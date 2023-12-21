import Vue from 'vue'
import App from './App.vue'

import VueRouter from 'vue-router'
import router from './router';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import store from './store/index'

// 全局挂载
// main.js  
import VueSocketIO from 'vue-socket.io'
import SocketIO from 'socket.io-client'
Vue.use(new VueSocketIO({
  debug: false,// 生产环境关闭，打开可在控制台查看socket连接和事件监听的信息
  options: {
    autoConnect: false //创建时是否自动连接，默认关闭，使用时用open开启链接
  },
  connection: SocketIO('http://127.0.0.1:3000'), //链接地址
}))  


Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueRouter)
new Vue({
  render: h => h(App),
  store,
  beforeCreate(){
    // bus有总线的意思
    Vue.prototype.$bus = this //安装全局总线
  },
  router:router
}).$mount('#app')
