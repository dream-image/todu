<template>
    <div id="out">
        <div id="container">
            <div style="width: 50px;height: 40px;overflow: visible;" ref="add" @mouseleave="closeTable">
                <div style="width: 50px;height: 40px;">
                    <el-button id="addButton" type="primary" circle @click="openTable" @mouseover.native="changeAddLabel(1)"
                        @mouseleave.native="changeAddLabel(0)">{{ addStr }}
                        <i v-if="addLabel" class="el-icon-circle-plus-outline" style="font-size:18px;"></i>
                    </el-button>
                </div>
                <transition appear name="animate__animated animate__bounce" enter-active-class='animate__fadeInTopLeft'
                    leave-active-class="animate__fadeOutTopRight">
                    <div id="triangle" v-show="isShow" key="2"> </div>
                </transition>
                <transition appear name="animate__animated animate__bounce" enter-active-class="animate__swing"
                    leave-active-class="animate__bounceOutUp">
                    <div id="addContainer" v-show="isShow">
                        <el-input class="add" placeholder="请输入事件名" v-model="name" clearable ref="inputName"
                            @keydown.native.enter="goDeadLine">
                        </el-input>
                        <el-input class="add" placeholder="请输入截止时间" v-model="deadline" clearable ref="inputTime"
                            @keydown.native.enter="isAdd">
                        </el-input>
                        <div style="display: flex;justify-content: space-around;">
                            <el-button type="success" icon="el-icon-check" circle @click.native="isAdd"></el-button>
                            <el-button type="danger" icon="el-icon-close" circle @click.native="closeTable"></el-button>
                        </div>
                    </div>
                </transition>
            </div>

            <h3 style="width: 300px;text-align: center;overflow: hidden; font-size: x-small;white-space: normal; cursor: pointer;"
             @click="getNew">{{ yuju }}</h3>
            <div id="insidecontainer">
                <input type="text" name="search" v-model="searchInput" placeholder="请输入要查询内容" @blur="init">
                <el-button id="searchButton" type="warning" @mouseover.native="changeSearchLabel(1)"
                    @mouseleave.native="changeSearchLabel(0)" @click.native="search">
                    {{ searchStr }}<i v-if="searchLabel" class="el-icon-search" style="font-size: 16px;"></i>
                </el-button>


            </div>

        </div>
        <div id="user" @mouseleave.active="displayOut(0)" style="overflow: visible;width: 160px;">
            <div id="first">
                <div id="userPicture">
                </div>
                <div @click.active="displayOut(1)" style="display: flex;align-items: center;height: 40px;cursor: pointer;">
                    <div id="userName">
                        {{ user }}
                    </div>
                    <div id="userChoose"></div>
                </div>

            </div>
            <transition-group appear name="animate__animated animate__bounce" enter-active-class="animate__fadeIn"
                leave-active-class="animate__fadeOut">
                <div id="assign" v-show="isShowLogOut" :key="1" @click="assignTask" style="{transition-delay: 1s;} ">
                    指派任务
                </div>
                <div id="logout" v-show="isShowLogOut" @click="logOut" :key="2" style="{transition-delay: 2s;}">
                    退出登陆
                </div>
            </transition-group>

        </div>

    </div>
</template>
<script scoped>
import 'animate.css'
import io from '../middleware/socket'
export default {
    name: 'Todohead',
    props: ['user'],
    data() {
        return {
            addLabel: false,
            addStr: '增',
            searchLabel: false,
            searchStr: '查',
            name: '',
            deadline: '',
            isShow: false,
            isShowLogOut: false,
            searchInput: '',
            yuju: ''
        }
    },
    methods: {
        assignTask() {
            this.$bus.$emit('showAssign')
        },
        openTable() {
            this.isShow = true
            this.$nextTick(function () {
                this.$refs.inputName.focus()
            })
        },
        goDeadLine() {
            this.$refs.inputTime.focus()
        },
        isAdd() {
            if (this.name.trim() == '')
                this.$message.error("事件名不能为空")
            else
                setTimeout(() => {
                    this.$confirm("是否添加？", "提示", {
                        iconClass: 'el-icon-question',
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                        showClose: true,
                        type: 'warning'
                    }).then(() => {
                        // 确认后操作
                        this.$store.dispatch('add', { EventName: this.name, Deadline: this.deadline, vm: this })
                        this.isShow = false
                        this.name = ''
                        this.deadline = ''
                    }).then(() => {
                        // 取消后操作

                    }).catch(function (err) {
                        console.log(err)
                    })
                }, 300);

        },
        closeTable() {
            this.isShow = false
        },
        changeAddLabel(val) {
            this.addLabel = val
            if (val) {
                this.addStr = ''
            }
            else this.addStr = '增'
        },
        changeSearchLabel(val) {
            this.searchLabel = val
            if (val) {
                this.searchStr = ''
            }
            else this.searchStr = '查'
        },
        displayOut(val) {
            if (val)
                this.isShowLogOut = true
            else {
                setTimeout(() => {
                    this.isShowLogOut = false
                }, 300);

            }
        },
        search() {
            this.$bus.$emit('search', this.searchInput)
        },
        init() {
            if (this.searchInput == '') {
                this.$bus.$emit('search', this.searchInput)
            }
        },
        logOut() {
            this.$router.replace({
                name: '登陆'
            })
            if (this.$socket.connected == true) {
                this.sockets.unsubscribe('todolist')
                this.$socket.emit('close', window.sessionStorage.getItem('userID'))
            }
            window.localStorage.removeItem('token')
            window.sessionStorage.removeItem('todoList')
            window.sessionStorage.removeItem('userID')
            window.sessionStorage.removeItem('userNicheng')
            this.$store.state.userName = ''
            this.$store.state.userPsw = ''
            this.$store.state.userNicheng = ''
            this.isShowLogOut = false
            // let socket =io()
            // this.socket.disconnect()



        },
        getNew(){
            this.$store.dispatch('getYiyan', { vm: this }) 
        }
    },
    mounted() {
        this.$store.dispatch('getYiyan', { vm: this })
    },
    activated() {
        this.$store.dispatch('getYiyan', { vm: this })
    },
}
</script>
<style scoped>
#out {
    width: 800px;
    height: 50px;
    border: 1px solid #bfa;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: #ece4e4;
    position: relative;
    left: 0;
    right: 0;
    margin: auto;
}

#container {
    width: 80%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

#addButton {
    width: 50px;
    padding: 0;
    height: 40px;
}

#addContainer {
    width: 200px;
    height: 150px;
    border: 1px wheat solid;
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    background-color: white;
    z-index: 99;
}

.add {
    width: 180px;
    display: block;
    position: relative;
    left: 0;
    right: 0;
    margin: auto;
}

#triangle {
    width: 0;
    height: 0;
    position: relative;
    left: 15px;
    border-bottom: 7px gray solid;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
}

#insidecontainer {
    align-items: center;
    height: 32px;

}

#searchButton {
    width: 50px;
    height: 30px;
    padding: 0;
    border: 0;
    box-sizing: border-box;
}

#searchButton:hover {
    border: 0;
}

[name='search'] {
    width: 200px;
    height: 30px;
    border: 1px solid gray;
    border-radius: 5%;
    box-sizing: border-box;
    border-right: 0;
}

[name='search']:hover {
    border: 2px gold solid;
    border-right: 0;
}

#user {
    display: flex;
    flex-direction: column;
    /* border: 1px solid black; */
    align-items: center;
    position: relative;
    right: 0px;
    overflow: hidden;
    height: 40px;
}

#first {
    display: flex;
    align-items: center;
}

#userPicture {
    width: 50px;
    height: 40px;
    border-radius: 50%;
    background-image: url('../../public/picture.jpg');
    background-size: cover;
}

#userName {
    margin: 2px;
    text-align: center;
    font-family: '楷书';
}

#userChoose {
    width: 0;
    height: 0;
    border-top: 7px rgb(154, 207, 236) solid;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
}

#userChoose :hover {
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    cursor: pointer;
}

#logout,
#assign {
    display: block;
    width: 160px;
    position: relative;
    /* border: 1px solid black; */
    height: 30px;
    text-align: center;
    line-height: 30px;
    background-color: wheat;
    border: 1px solid #b49b7f;
}

#assign:hover,
#logout:hover {
    background-image: linear-gradient(135deg, #fdeb71, #f8d800);
}</style>