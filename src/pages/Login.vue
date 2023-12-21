<template>
    <div id="wrap">
        <transition appear name="animate__animated animate__bounce" enter-active-class="animate__fadeInLeftBig"
            leave-active-class="animate__fadeOutRightBig">
            <div id="donghua" v-if="isinOutShow">
                <form id="window">
                    <div id="ziti">
                        欢迎使用todo事件管理
                    </div>
                    <el-input v-model="userName" placeholder="请输入用户名" id="inputName" @keydown.enter.native="gotoPsw"
                    clearable  
                    ref="inputID" style="width: 200px;border-radius: 10px;" prefix-icon="el-icon-user-solid"
                       >
                    </el-input>
                    <el-input placeholder="请输入密码" v-model="userPsw" show-password id="inputPsw" ref="Psw"
                        @keyup.enter.native="isSvgShow?$refs.captcha.focus():login()" style="width: 200px;border-radius: 10px;"
                        prefix-icon="el-icon-s-goods"></el-input>
                    <div id="captcha" v-if="isSvgShow" style="display: flex; justify-content: space-around;height: 50px;width: 200px;align-items: center;">
                        <el-input placeholder="验证码" v-model="captcha" style="width: 100px;border-radius: 10px; "
                            prefix-icon="el-icon-s-ticket" ref="captcha" @keydown.enter.native="login">
                        </el-input>
                        <a style="width: 100px;height: 50px;" @click.prevent="getCaptcha" ref="svg" title="看不清？点击刷新">
                            
                        </a>
                    </div>
                    <div id="inOutBtn">
                        <el-button type="primary" round class="inOutBtn" @click="login">登陆</el-button>
                        <el-button type="primary" round class="inOutBtn" @click="register">注册</el-button>
                    </div>

                </form>
            </div>
        </transition>
    </div>
</template>
<script scoped>
import { Message } from 'element-ui'

export default {
    name: 'login',
    data() {
        return {
            userName: '',
            userPsw: '',
            isinOutShow: true,
            captcha: '',
            isSvgShow:false,
        }
    },
    methods: {
        login() {
            if (this.userName.length == 0)
                this.$message.error('用户名不能为空')
            else if (this.userPsw.length == 0)
                this.$message.error('密码不能为空')
            else if(this.isSvgShow && !this.captcha){
                Message.error('请输入验证码')
            }
            else
                this.$store.dispatch('login', { userName: this.userName, userPsw: this.userPsw, vm: this,captcha:this.captcha});
        },
        register() {
            this.isinOutShow = false
            setTimeout(() => {
                this.$router.push({
                    name: '注册',
                })
            }, 800);


        },
        gotoPsw() {
            setTimeout(() => {
                this.$refs.Psw.focus()
            }, 100);

        },
        getCaptcha() {
            this.$store.dispatch('Captcha', { vm: this, isSvgShow:this.isSvgShow, userName: this.userName })
        },
       
    },
    watch: {
        userName(oldvalue, newvalue) {
            if (oldvalue != newvalue && this.isSvgShow) {
                this.isSvgShow=false
                this.captcha=''
            }
        }
    },
    mounted() {
        this.$nextTick(function () {
            this.$refs.inputID.focus()
            console.log("Login", this.$parent.$children)
        })
        if (this.$bus.isfill == true) {
            this.$bus.isfill = false
            this.userName = this.$bus.userName
            this.userPsw = this.$bus.userPsw
            this.$message.success("注册成功")


        }
    },
    activated() {
        this.userName = ''
        this.userPsw = ''
        this.isinOutShow = true
        this.$nextTick(function () {
            this.$refs.inputID.focus()
        })
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

#ziti {
    font-family: "方正舒体";
    font-size: 20px;
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
    position: absolute;
    text-align: center;
    top: 0px;
    bottom: 0px;
    height: 300px;
    width: 250px;
    align-items: center;
    border: 1px solid wheat;
    background-color: #f6e8e5;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    overflow: hidden;
    z-index: 2;
    margin: auto auto;
    border-radius: 20px;
}

#donghua {
    border-radius: 20px;
    overflow: hidden;
    height: 306px;
    width: 256px;
    left: 0;
    right: 0;
    margin: auto;
    top: 150px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
}

#donghua::before {
    content: "";
    align-items: center;
    position: absolute;
    width: 350px;
    height: 350px;
    background-image: conic-gradient(transparent,
            transparent,
            transparent,
            gold);
    border-radius: 20px;
    animation: change 4s linear infinite;
}

#donghua::after {
    content: "";
    align-items: center;
    position: absolute;
    width: 350px;
    height: 350px;
    background-image: conic-gradient(transparent,
            transparent,
            transparent,
            #00ccff);
    border-radius: 20px;
    animation: change 4s linear infinite;
    animation-delay: -2s;
}

@keyframes change {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg)
    }
}


#inOutBtn {
    width: 200px;
    height: 30px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

}

.inOutBtn {
    background-color: rgba(68, 156, 252, 0.7);
    border: none;
    text-decoration: none;
    text-align: center;
    line-height: 0;
}</style>