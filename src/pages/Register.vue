<template>
    <div id="wrap">
        <transition appear name="animate__animated animate__bounce" enter-active-class="animate__fadeInUpBig"
            leave-active-class="animate__fadeOutUpBig">
            <form id="window" v-if="isRegisterShow">
                <div>
                    注册
                </div>
                <el-input v-model="userNicheng" placeholder="请输入昵称" id="userNicheng" ref="inputNicheng"
                    @keydown.native.enter="gotoID" style="width: 200px;" prefix-icon="el-icon-user"></el-input>
                <h3 v-if="isShowNichengTip">*昵称长度应在1~10位之间</h3>
                <div>
                    <el-input v-model="userName" placeholder="请输入用户名" id="inputName2" ref="inputID"
                        @keydown.native.enter="gotoPsw" style="width: 200px;" prefix-icon="el-icon-user-solid"></el-input>
                    <h3 v-if="isShowNameLengthTip">*用户名长度应该在8~16位之间!!</h3>
                    <h3 v-if="isShowNameStrTip">*用户名不允许出现特殊字符</h3>
                </div>

                <el-input placeholder="请输入密码" v-model="userPsw" show-password style="width: 200px;" ref="inputPsw"
                    @keydown.native.enter="gotoRepeatPsw" prefix-icon="el-icon-goods"></el-input>
                <div>
                    <el-input placeholder="请确认密码" v-model="repeatUserPsw" show-password style="width: 200px;"
                        ref="inputRepeatPsw" @keydown.native.enter="register" prefix-icon="el-icon-s-goods"></el-input>
                    <h3 v-if="isShowPswTip">*前后密码不一致！！！</h3>
                </div>

                <el-input placeholder="请输入电话号码" style="width: 200px;" prefix-icon="el-icon-phone" v-model.number="phone" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
                <div style="display: flex;width: 200px;justify-content: space-between;">
                    <el-input placeholder="请输入验证码" style="width: 100px;"  v-model.number="code" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
                    <div style="width: 80px;">
                        <el-button type="primary" style="width: 80px;" :disabled="isDisabled" @click="sendCode">{{ sendTime }}</el-button>
                       
                    </div>
                    
                </div>
                
                <div id="btnWrap">
                    <el-button type="primary" round class="btn" @click="register">确认</el-button>
                    <el-button type="primary" round class="btn" @click="cancel">取消</el-button>
                </div>

            </form>

        </transition>

    </div>
</template>
<script >
import { Message } from 'element-ui'

function checkStr(Str) {
    for (let i of Str) {
        if (i.search(/[0-9a-zA-z]/)) {
            return true
        }
    }
    return false
}
export default {
    name: 'login',
    data() {
        return {
            userNicheng: '',
            userName: '',
            userPsw: '',
            repeatUserPsw: '',
            isRegisterShow: true,
            isShowPswTip: false,
            isShowNameLengthTip: false,
            isShowNameStrTip: false,
            isShowNichengTip: false,
            isDisabled:false,
            code:'',
            phone:'',
            time:0,
            sendTime:'发送',
        }
    },
    methods: {
        register() {
            // 传递信息
            if (this.userNicheng.length < 1 || this.userNicheng.length > 10)
                Message.error('昵称长度不符合要求')
            else if (this.userName.length < 8 || this.userName.length > 16) {
                this.$message.error('用户名长度不符合要求')
                this.$refs.inputID.focus()
            }
            else if (this.userPsw.length == 0 || this.repeatUserPsw.length == 0)
                this.$message.error('密码不能为空')
            else if (checkStr(this.userName))
                this.$message.error('用户名不能包含特殊字符')
            else if(this.phone.toString().length !=11)
                Message.error('电话号码格式错误')
            else if(this.code.toString().length !=4)
                Message.error('验证码格式错误')
            else if (this.userName.length >= 8 && this.userName.length <= 16 && this.isShowPswTip == false) {
                this.$store.dispatch('register', { userName: this.userName, userPsw: this.userPsw, vm: this, userNicheng: this.userNicheng,code:this.code,phone:this.phone })
            }
            else {
                this.$message.error('前后密码不一致')
            }
        },
        cancel() {
            this.isRegisterShow = false
            setTimeout(() => {
                this.userName = ''
                this.userPsw = '',
                    this.repeatUserPsw = ''
                this.userNicheng = ''
                this.$router.push({
                    name: '登陆',

                })
            }, 1000);

        },
        gotoID() {
            this.$refs.inputID.focus()
        },
        gotoPsw() {
            this.$refs.inputPsw.focus()
        },
        gotoRepeatPsw() {
            this.$refs.inputRepeatPsw.focus()
        },
        sendCode(){
            if(this.phone.toString().length==11)
            this.$store.dispatch('verifyCode',{vm:this,phone:this.phone})
            else Message.error('电话号码错误')
        }
    },
    watch: {
        repeatUserPsw(newvalue, oldvalue) {
            if (newvalue != this.userPsw) {
                this.isShowPswTip = true
            }
            else {
                this.isShowPswTip = false
            }
        },
        userName(newvalue, oldvalue) {
            if (checkStr(newvalue)) {
                this.isShowNameStrTip = true
                this.isShowNameLengthTip = false
            }
            else {
                this.isShowNameStrTip = false
                if (newvalue.length < 8 || newvalue.length > 16) {
                    this.isShowNameLengthTip = true
                }
                else {
                    this.isShowNameLengthTip = false
                }
            }
        },
        userNicheng(newvalue, oldvalue) {
            if (newvalue.length < 1 || newvalue.length > 10) {
                this.isShowNichengTip = true
            }
            else {
                this.isShowNichengTip = false
            }
        }

    },
    mounted() {

        this.$nextTick(() => {
            this.$refs.inputNicheng.focus()
            this.isRegisterShow = true
            console.log(this.$parent.$children)
        })
    },
}
</script>
<style>
* {
    margin: 0;
    padding: 0;
    list-style: none;
    font-family: "SF Pro SC", "SF Pro Text", "SF Pro Icons", "PingFang SC", Verdana, Arial, '微软雅黑', '宋体';
    font-size: 14px;
    box-sizing: border-box;
}


#wrap {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    margin: 0;
    background-repeat: no-repeat;
    background-size: cover;
    background-image: url('../../public/background.jpg');
}

#window {
    position: relative;
    left: 0;
    right: 0;
    margin: auto;
    top: 100px;
    align-items: center;
    text-align: center;
    height: 400px;
    width: 300px;
    border: 1px solid wheat;
    background-color: rgba(68, 156, 252, 0.6);
    box-shadow: 3px 3px rgba(68, 156, 252, 0.3);
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    border-radius:10px;
}

h3 {
    color: rgba(244, 108, 108, 0.6);
}

#inputName2,
#userNicheng {
    width: 200px;
}

#btnWrap {
    width: 200px;
    height: 30px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

}

.btn {
    background-color: rgba(68, 156, 252, 0.7);
    border: none;
    text-decoration: none;
    text-align: center;
    line-height: 0;
}
</style>