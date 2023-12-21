import { Message } from 'element-ui'
import VueRouter from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'

const router = new VueRouter({
    mode:'history',
    routes: [
        {
            path: '/',
            redirect: '/login',
        },
        {
            name: '登陆',
            path: '/login',
            component: Login,
            meta: { title: '登陆' },

        },
        {
            name: '注册',
            path: '/register',
            component: Register,
            meta: { title: '注册' }
        },
        {
            name: '主页',
            path: '/homepage',
            component: HomePage,
            meta: { title: 'todo主页', isAuth: true },

        },

    ]
})

router.beforeEach((to, from, next) => {
    let isLogin = window.localStorage.getItem('token')
    if (!isLogin && to.name == '主页') {
        next('/login')
        Message.error('警告:非法操作！')
    }
    else { next() }
    if (to.meta.isAuth) {


    }
})

router.afterEach((to, from) => {
    document.title = to.meta.title
})
export default router