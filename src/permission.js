import router from './router'
//import store from './store'
import { getToken } from '@/utils/auth'
//import Vue from 'vue' // 验权
const whiteList = ['/', '/404', '/register']// 白名单,不需要登录的路由

router.beforeEach((to, from, next) => {
    if (to.matched.length === 0) {
        next({ path: '/404' }) // 判断此跳转路由的来源路由是否存在，存在的情况跳转到来源路由，否则跳转到404页面
    }
    if (getToken()) {// login successed!
        //Vue.prototype.showloginBtn = false
        if (to.path === '/') {
            next({ path: '/panel' })
        }
        next()
    } else if (whiteList.indexOf(to.path) !== -1) {// white list
        // whiteList.
        next()
    } else {
        //store.commit('RESET_USER')
        next({ path: '/404' })
    }
})
router.afterEach(() => {
})