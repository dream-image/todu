// 该文件用于创建vuex核心的store
import Vue from 'vue'
// 引入Vuex
import Vuex from 'vuex'
// 应用Vuex插件

import axios from 'axios'
import { Message } from 'element-ui'
import io from '../middleware/socket'
import md5 from 'js-md5'
Vue.use(Vuex)

const instance = axios.create({
    timeout: 5000, // 设置超时时间为 5 秒
    timeoutErrorMessage: '请求超时，请稍后再试', // 设置超时错误提示
});

// 准备actions 用于响应组件中的动作
const actions = {
    getYiyan(context, obj) {

        axios.get('https://api.uixsj.cn/hitokoto/get?code=json').then((data) => {
            console.log(data.data.content)
            obj.vm.yuju = data.data.content
        })
    },
    login(context, data) {
        axios.post('http://localhost:3000/todo/login', {
            params: {
                id: data.userName,
                password: md5(data.userPsw),
                captcha: data.captcha
            }
        }).then(function (obj) {
            window.localStorage.setItem('token', obj.data.token)
            window.sessionStorage.setItem('userNicheng', obj.data.Nicheng)
            setTimeout(() => {
                data.vm.$router.push({
                    name: '主页',
                })
            }, 2000);
            data.vm.isinOutShow = false
            data.vm.$message.success('登陆成功')
            obj.data.todoList.sort(function (a, b) {
                return a.State < b.State
            })
            window.sessionStorage.setItem('todoList', JSON.stringify(obj.data.todoList))
            window.sessionStorage.setItem('userID', data.userName)
            obj.data.todoList.forEach((data) => {
                data.display = false
            })
            data.vm.$parent.sessionList = obj.data.todoList
            context.commit('LOGIN', { name: data.userName, Nicheng: obj.data.Nicheng, todoList: obj.data.todoList })
        }).catch(function (err) {
            data.vm.$message.error(err.response.data.msg)
            if ('密码错误,验证码错误,请输入验证码'.search(err.response.data.msg) != -1) {
                data.vm.isSvgShow = true
                data.vm.captcha = ''
                data.vm.$nextTick(() => {
                    data.vm.$refs.svg.innerHTML = err.response.data.svg
                    data.vm.$refs.captcha.focus()
                })
            }
        })
    },
    Captcha(context, data) {
        axios.get('http://localhost:3000/captcha', {
            params: {
                id: data.userName
            }
        }).then(obj => {
            data.vm.$nextTick(() => {
                console.log(obj)
                data.vm.$refs.svg.innerHTML = obj.data
                console.log(data.vm.$refs.svg)
            })
        }).catch(err => {
            console.log(err.response.data)
            Message.error(err.response.data)
        })
    },
    verifyCode(context, data) {
        axios.post('http://localhost:3000/todo/Code', null, {
            params: { phone: data.phone }
        }).then(function (obj) {
            console.log(obj.data.msg)
            Message.success(obj.data.msg)
            data.vm.isDisabled = true
            data.vm.time = 60
            data.vm.sendTime = 60
            let x = setInterval(() => {
                data.vm.time -= 1
                data.vm.sendTime -= 1
            }, 1000);
            setTimeout(() => {
                data.vm.isDisabled = false
                clearInterval(x)
                data.vm.sendTime = '发送'
            }, 60000);
        }).catch((err) => {
            console.log(err.response.data.msg)
            Message.error(err.response.data.msg)
        })
    },
    register(context, data) {
        axios.post('http://localhost:3000/todo/register', null, {
            params: {
                id: data.userName,
                password: md5(data.userPsw),
                Nicheng: data.userNicheng,
                code: data.code,
                phone: data.phone
            }
        },
        ).then(function (obj) {
            console.log('注册请求发送成功', obj.data)
            setTimeout(() => {
                data.vm.$router.replace({
                    name: '登陆',

                })
                data.vm.userName = ''
                data.vm.userPsw = '',
                    data.vm.repeatUserPsw = ''
            }, 1000);
            data.vm.isRegisterShow = false
            data.vm.$bus.userName = data.userName
            data.vm.$bus.userPsw = data.userPsw
            data.vm.$bus.isfill = true
            context.commit('REGISTER', { Name: data.userName, Psw: data.userPsw, Nicheng: data.userNicheng })
        }).catch(function (err) {
            console.log(err.response.data)
            Message.error(err.response.data)
        })
    },
    Update(context, obj) {
        axios.put('http://localhost:3000/todo/' + obj.EventName,
            {
                State: obj.State,
                UserID: obj.UserID,
                DeadLine: obj.DeadLine,
            },
            {
                headers: {
                    Authorization: window.localStorage.getItem('token')
                }
            }
        ).then(function () {
            Message.success('修改成功')
            console.log('111')
            let oldlist = window.sessionStorage.getItem('todoList')
            oldlist = JSON.parse(oldlist)
            if (obj.UpdateWho == 'State') {
                obj.vm.obj.State = !obj.vm.obj.State
                for (let i of oldlist) {
                    if (i.EventName == obj.EventName) {
                        i.State = obj.State == true ? 1 : 0
                        break;
                    }
                }
                oldlist.sort((a, b) => {
                    return a.State - b.State
                })
                obj.vm.$parent.sessionList = oldlist
                context.commit('UPDATE', oldlist)
                window.sessionStorage.setItem('todoList', JSON.stringify(oldlist))
            } else {
                for (let i of oldlist) {
                    if (i.EventName == obj.EventName) {
                        i.DeadLine = obj.DeadLine
                        break;
                    }
                }
                obj.vm.$parent.sessionList = oldlist
                context.commit('UPDATE', oldlist)
                window.sessionStorage.setItem('todoList', JSON.stringify(oldlist))
            }
        }).catch(function (err) {
            Message.error(err.response.data)
        })
    },
    delete(context, obj) {
        axios.delete('http://localhost:3000/todo/' + obj.EventName, {
            data: {
                UserID: obj.UserID
            },
            headers: {
                Authorization: window.localStorage.getItem('token')
            }
        }
        ).then(function (data) {
            console.log('删除成功')
            Message.success('成功删除')
            let oldlist = window.sessionStorage.getItem('todoList')
            oldlist = JSON.parse(oldlist)
            let newlist = []
            for (let i of oldlist) {
                if (i.EventName != obj.EventName) {
                    newlist.push(i)
                }
            }
            context.commit('DELETE', newlist)
            window.sessionStorage.setItem('todoList', JSON.stringify(newlist))
            obj.vm.$parent.sessionList = newlist
        }).catch(function (err) {
            console.log(err)
            Message.error(err.response.data)
        })
    },
    add(context, obj) {
        axios.post('http://localhost:3000/todo', {
            query: {
                EventName: obj.EventName,
                Deadline: obj.Deadline,
                UserID: window.sessionStorage.getItem('userID')
            }
        },
            {
                headers: {
                    Authorization: window.localStorage.getItem('token')
                }
            }
        ).then((data) => {
            let newlist = JSON.parse(window.sessionStorage.getItem('todoList'))
            newlist.unshift({
                EventName: obj.EventName,
                DeadLine: obj.Deadline,
                State: 0,
                UserID: window.sessionStorage.getItem('userID'),
                createdBy: window.sessionStorage.getItem('userID'),
            })
            window.sessionStorage.setItem('todoList', JSON.stringify(newlist))
            obj.vm.$parent.sessionList = newlist
            context.commit('ADD', newlist)
        }).catch(function (err) {
            console.log(err)
            Message.error(err.response.data)
        })
    },
    getUserList(context, data) {
        axios.get('http://localhost:3000/userList', {
            params: {
                userID: data.userID
            }
        }).then(obj => {
            let list = obj.data
            data.vm.options.splice(0, data.vm.options.length)
            list.forEach(i => {
                data.vm.options.push({ value: i['UserID'] })
            })
        }).catch(err => {
            Message.error(err.response.data.msg)
        })
    },
    assignTask(context, data) {
        axios.post('http://localhost:3000/task', {
            params: {
                createdBy: data.createdBy,
                assignTo: data.assignTo,
                deadline: data.deadline,
                task: data.task
            }
        }).then(obj => {
            Message.success(obj.data.msg)
            // let socket = io('http://localhost:3000');
            console.log("指派任务了", data.createdBy, data.assignTo)
            data.vm.$socket.emit('todolist', { createdBy: data.createdBy, assignTo: data.assignTo })
        })
    }
}

// 准备mutations 用于操作数据 state
const mutations = {
    LOGIN(state, value) {
        state.userName = value.name
        state.userNicheng = value.Nicheng
        state.todoList = value.todoList
    },
    REGISTER(state, data) {
        state.userName = data.Name,
            state.userPsw = data.Psw,
            state.userNicheng = data.Nicheng
    },
    UPDATE(state, newlist) {
        state.todoList = newlist
    },
    DELETE(state, newlist) {
        state.todoList = newlist
    },
    ADD(state, newlist) {
        state.todoList = newlist
    }
}

// 准备state 用于储存数据
const state = {
    userName: '',
    userPsw: '',
    userNicheng: '',
    todoList: []
}

const getters = {}
// 创建并暴露store
export default new Vuex.Store({
    actions: actions,
    mutations,
    state
})
