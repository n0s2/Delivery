import { createStore } from 'vuex'

export default createStore({
    state: {
        base: {
            id: 0,
            uName: '',
            uAvatar: '../img/defaultAvatar.png',
            token: '',
            uTele: 0,
            uEmail: 0,
            uUnread: 0,
            uWcm: 0,
            uBacklog: 0,
            uDate: 0
        },
        tips: '',
        openedTab: [
            {
                id: 1,
                name: '仪表盘'
            }
        ],
        ownGourp: [{}],
        joinedGroup: [{}],
        msgInbox: [{}],
        update: false

    },
    mutations: {
        updateUsrBase(state, payload) {
            state.base = payload
        },
        updateUsrGroups(state, payload){
            state.joinedGroup = payload
        },
        updateUsrTabs(state, payload) {
            state.openedTab = payload
        },
        updateUsrInbox(state, payload) {
            state.msgInbox = payload
        }

    },
    actions: {
        // 定义actions，用于修改状态(异步) 
        /*
        updateInfo(context, payload) {
            setTimeout(() => {
                context.commit('updateInfo', payload)
            }, 2000)
        }
        */
    },
    getters: {
        // 定义一个getters
        formatInfo(state) {
            return state.base.uid
        }
    },
    modules: {
    }
})

