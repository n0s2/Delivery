import router from './router'
//import store from './store'
import { getToken } from '@/utils/auth'
//import Vue from 'vue' // ��Ȩ
const whiteList = ['/', '/404', '/register']// ������,����Ҫ��¼��·��

router.beforeEach((to, from, next) => {
    if (to.matched.length === 0) {
        next({ path: '/404' }) // �жϴ���ת·�ɵ���Դ·���Ƿ���ڣ����ڵ������ת����Դ·�ɣ�������ת��404ҳ��
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