<template>
  <div id="app" style="display: flex;flex-direction: column;justify-content: space-around;">
    <todoHead :user="userNicheng"></todoHead>
    <div id="list">
      <div id="createdBy">
        <div id="myself" @click="changeCreatedBy('myself')" ref="myself">
          自己
        </div>
        <div id="others" @click="changeCreatedBy('others')" ref="others">
          他人
        </div>
      </div>
      <div style="width: 480px;">
        <li v-for="p in CheckList" :key="p.id">
          <todoList :obj="p" :createdBy="createdBy"></todoList>
        </li>
      </div>
    </div>
    <el-dialog title="指派任务" :visible.sync="dialogVisible" width="30%">
      <el-form
        style="display: flex;flex-direction: column;justify-content: space-around;height: 150px; align-items: center;">
        <el-input style="width: 200px;border-radius: 10px;" placeholder="请输入事件" prefix-icon="el-icon-tickets"
          v-model="task" @keydown.enter.native="goDeadlineInput" ref="Tinput" clearable></el-input>
        <el-input style="width: 200px;border-radius: 10px;" placeholder="请输入截止日期" prefix-icon="el-icon-date"
          v-model="deadline" ref="Dinput" @keydown.enter.native="goChoose" clearable></el-input>
        <el-select v-model="chosenUser" filterable placeholder="请选择用户" style="width: 200px;" ref="chooseUser" clearable>
          <el-option v-for="item in options" :key="item.value" :label="item.value" :value="item.value">
          </el-option>
        </el-select>
      </el-form>
      <span slot="footer" class="dialog-footer" style="display: flex;justify-content: space-around;">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignTask">确 定</el-button>
      </span>


    </el-dialog>
  </div>
</template>
  
<script scoped>
import { Message } from 'element-ui'
import todoList from './Todo'
import todoHead from './TodoHead'
import io from '../middleware/socket'

import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
export default {
  name: 'HomePage',
  components: {
    todoList,
    todoHead,

  },
  data() {
    return {
      keyWord: '',
      sessionList: [],
      createdBy: 'myself',
      userNicheng: '',
      dialogVisible: false,
      chosenUser: '',
      deadline: '',
      task: '',
      options: [
      ],
      heartbeat:''
    }
  },
  computed: {
    CheckList() {
      if(this.$socket.connected ==false){
        this.$socket.open()
      }
      console.log("CheckList更新了")
      let newlist
      if (this.createdBy == 'myself') {
        newlist = this.sessionList.filter((obj) => {
          return obj.createdBy == obj.UserID
        })
      }
      else {
        newlist = this.sessionList.filter((obj) => {
          return obj.createdBy != obj.UserID
        })
      }
      return newlist.filter((obj) => {
        return obj.EventName.indexOf(this.keyWord) != -1
      })
    },
    ...mapState(['todoList', 'userName', 'userPsw'])
  },
  methods: {
    changeCreatedBy(a) {
      this.createdBy = a
      if (a == 'myself') {
        this.$refs.myself.style.backgroundImage = "linear-gradient(308deg,#42e695,#3bb2b8)"
        this.$refs.others.style.backgroundImage = "linear-gradient(135deg,#ece9e6,#ffffff)"
      }
      else {
        this.$refs.myself.style.backgroundImage = "linear-gradient(135deg,#ece9e6,#ffffff)"
        this.$refs.others.style.backgroundImage = "linear-gradient(308deg,#42e695,#3bb2b8)"
      }
    },
    goDeadlineInput() {
      this.$refs.Dinput.focus()
    },
    goChoose() {
      this.$refs.chooseUser.focus()
    },
    assignTask() {
      if (this.task.length == 0)
        Message.error('事件不能为空')
      else if (this.deadline.length == 0)
        Message.error('截止日期不能为空')
      else if (this.chosenUser.length == 0)
        Message.error('被指派用户不能为空')
      else
        this.$confirm("是否指派任务给" + this.chosenUser + "?", "提示", {
          iconClass: 'el-icon-question',
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          showClose: true,
          type: 'warning'
        }).then(() => {
          // 确认后操作
          if(this.$socket.connected==false){
            throw new Error("连接已断开，等待重连")
          }
          this.$store.dispatch('assignTask', {
            vm: this, assignTo: this.chosenUser, createdBy: window.sessionStorage.getItem('userID'),
            task: this.task, deadline: this.deadline
          })
          this.task = ''
          this.deadline = ''
          this.chosenUser = ''
          this.dialogVisible = false
        }).then(() => {
          // 取消后操作

        }).catch(function (err) {
          console.log(err)
        })
    }
  },
  mounted() {
    console.log('mounted加载')
    this.$bus.$on('search', (data) => {
      console.log('收到了keyword')
      this.keyWord = data
    })
    this.userNicheng = window.sessionStorage.getItem('userNicheng')
    this.$bus.$on('showAssign', (data) => {
      this.dialogVisible = true
      this.$store.dispatch('getUserList', { vm: this, userID: window.sessionStorage.getItem('userID') })
      setTimeout(() => {
        this.$refs.Tinput.focus()
      }, 200);
    })
      // let socket = io('http://localhost:3000')
      // console.log("延迟器")

      // socket.on('connect_error', err => {
      //   console.log("socket连接失败", err)
      // })
      // let userID = window.sessionStorage.getItem('userID')
      // //  socket.emit('todolist',{userID:userID})

      // socket.on('todolist', data => {
      //   console.log('todolist响应', data)
      //   if (data.code == 1) {
      //     if (data.assignTo == userID) {
      //       Message.success(data.msg)
      //       console.log("收到了指派的任务", data)
      //       window.sessionStorage.setItem('todoList', JSON.stringify(data.todolist))
      //       this.sessionList.splice(0, this.sessionList.length)
      //       data.todolist.forEach(i => {
      //         this.sessionList.push(i)
      //       })
      //     }

      //   } else {
      //     Message.error(data.msg)
      //   }

      // })
      let userID = window.sessionStorage.getItem('userID')
    this.$socket.open()
    setTimeout(() => {
      if(this.$socket.connected==true){
        this.$socket.emit('joined',userID)
        Message.success("连接成功建立")
      }else{
        Message.error("连接断开")
      }
      
    }, 1000);
    
    this.sockets.subscribe('todolist', data => {
        console.log('todolist响应', data)
        if (data.code == 1) {
          if (data.assignTo == userID) {
            Message.success(data.msg)
            console.log("收到了指派的任务", data)
            window.sessionStorage.setItem('todoList', JSON.stringify(data.todolist))
            this.sessionList.splice(0, this.sessionList.length)
            data.todolist.forEach(i => {
              this.sessionList.push(i)
            })
          }
        } else {
          Message.error(data.msg)
        }
      })

    setTimeout(() => {
      let heartbeat = setInterval(() => {
        if(this.$socket.connected==false)
          {
            this.$socket.open()
            this.$socket.emit('joined',userID)
            Message.success("重新建立连接")
          }
          else{
            console.log("连接已建立")
          }
      }, 30000);
    }, 1000);
  },
  sockets: { //监听用的是this.sockets   发送消息是this.$socket
        connecting() { console.log('正在连接') },
        connect() { console.log('连接成功') },
        disconnect() { console.log('断开连接') },
        connect_failed() { console.log('连接失败') },
        error() { console.log('错误发生，并且无法被其他事件类型所处理') },
        reconnecting() { console.log('正在重连') },
        reconnect_failed() { console.log('重连失败') },
        reconnect() { console.log('重连成功') },
  },
  beforeDestroy() {
    // let socket = io('http://localhost:3000')
    // socket.disconnect()
    if(this.$socket.connected ==true){
      this.sockets.unsubscribe('todolist')
      this.$socket.emit('close',window.sessionStorage.getItem('userID'))
      }
    if(this.heartbeat!=''){
      clearInterval(this.heartbeat)
      console.log("已摧毁心跳")
    }
    console.log('首页被摧毁')
    this.$bus.$off('search')
    this.$bus.$off('showAssign')
  },
  created() {
    this.sessionList = JSON.parse(window.sessionStorage.getItem('todoList'))
  },
  
}
</script>
  
<style scoped>
* {
  margin: 0;
  padding: 0;
  list-style: none;
  font-family: "SF Pro SC", "SF Pro Text", "SF Pro Icons", "PingFang SC", Verdana, Arial, '微软雅黑', '宋体';
  font-size: 14px;
  box-sizing: border-box;
}

#list {
  display: flex;
  align-items: center;
  position: relative;
  left: 0;
  right: 0;
  margin: auto;
}

#createdBy {
  height: 60px;
  width: 70px;
  position: absolute;
  left: -70px;
  top: 0px;

}

#createdBy div {
  height: 30px;
  width: 70px;
  text-align: center;
  line-height: 30px;
  border: 1px solid #108b96;

}

#myself {
  background-image: linear-gradient(308deg, #42e695, #3bb2b8);
}

#createdBy div:hover {
  background-image: linear-gradient(308deg, #42e695, #3bb2b8);
}
</style>
  