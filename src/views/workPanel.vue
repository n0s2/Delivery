<template>
    <div>
        <t-layout style="">
            <t-aside class="_aside_item_c11y2" fixed>
                <div :style="{'width': !collapsed?'232px':'64px','height': '100%'}">
                    <t-menu v-model="navValue" @change="changeNav" :style="{'width': !collapsed?'232px':'64px','height': '100%', 'left': '0'}" theme="dark" default-value="dashboard" class="tAnimate tdesign-starter-side-nav" :collapsed="collapsed">
                        <template #logo>
                            <img style="margin-left: 24px;" height="28" :src="avatarUrl" alt="logo" @click="debugMethod"/>
                        </template>
                        <t-menu-item value="dashboard" @click="">
                            <template #icon>
                                <t-icon name="dashboard" />
                            </template>
                            仪表盘
                        </t-menu-item>
                        <t-menu-item value="control-platform">
                            <template #icon>
                                <t-icon name="control-platform" />
                            </template>
                            创意社区
                        </t-menu-item>
                        <t-menu-item value="resource" @click="addTab({ 'value': 'panel/groups', 'label': '我的群组' })">
                            <template #icon>
                                <t-icon name="server" />
                            </template>
                            我的群组
                        </t-menu-item>
                        <t-menu-item value="mail" @click="addTab({ 'value': 'panel/message', 'label': '我的消息' })">
                            <template #icon>
                                <t-icon name="mail" />
                            </template>
                            我的消息
                        </t-menu-item>
                        <t-menu-item value="user-circle" @click="addTab({ 'value': 'panel/config', 'label': '个人中心' })">
                            <template #icon>
                                <t-icon name="user-circle" />
                            </template>
                            个人中心
                        </t-menu-item>
                        <t-menu-item value="edit1" @click="addTab({ 'value': 'panel/plugins', 'label': '社区插件' })">
                            <template #icon>
                                <t-icon name="edit-1" />
                            </template>
                            社区插件
                        </t-menu-item>
                    </t-menu>
                </div>
            </t-aside>
            <t-layout>
                <t-header>
                    <t-head-menu theme="light" @change="changeHandler">
                        <t-button variant="text" shape="square" style="margin-right: 12px;" @click="makeCollapse">
                            <template #icon>
                                    <t-icon v-if="collapsed" name="menu-fold" />
                                    <t-icon v-else name="menu-unfold" />
                            </template>
                        </t-button>

                        <template #operations>
                            <t-button variant="text" shape="square">
                                <template #icon>
                                    <t-icon name="search" />
                                </template>
                            </t-button>
                            <t-button variant="text" shape="square">
                                <template #icon>
                                    <t-icon name="mail" />
                                </template>
                            </t-button>
                            <t-button variant="text" shape="square">
                                <template #icon>
                                    <t-icon name="user" />
                                </template>
                            </t-button>
                            <t-dropdown :options="options" @click="clickHandler">
                                <t-space>
                                    <t-button variant="text" shape="square">
                                        <template #icon>
                                            <t-icon name="ellipsis" />
                                        </template>
                                    </t-button>
                                </t-space>
                            </t-dropdown>
                        </template>
                    </t-head-menu>
                </t-header>
                <t-content>
                    <t-tabs class="boxr" v-model="value" theme="normal" @change="onCangeTab" @add="addTab" @remove="removeTab">
                        <t-tab-panel v-for="data in panelData"
                                     :key="data.value"
                                     :value="data.value"
                                     :label="data.label"
                                     :removable="data.removable">
                            <div class="layer" />
                            <router-view 
                                         @_addTab="addTab" 
                                         @_suicide="suicide"
                                         @_quit="quit"
                                         v-if="updateViewStatu"/>
                        </t-tab-panel>
                    </t-tabs>
                </t-content>
                <t-footer>
                    Copyright © 2023-2023 C11y.WZBC. All Rights Reserved
                </t-footer>
            </t-layout>
        </t-layout>
    </div>
</template>

<script setup>
    //获取token token存在store不存在则获取store  替换sessionStorage

    import { ref } from 'vue';
    import { MenuUnfoldIcon, MenuFoldIcon } from 'tdesign-icons-vue-next';
    import { useRouter } from "vue-router"
    import { getCurrentInstance } from 'vue'
    const { proxy } = getCurrentInstance()

    //在仪表盘及所有子界面装在拦截器加入header
    proxy.$http.interceptors.request.use(
        config => {
            config.headers['Content-Type'] = 'application/json'
            config.headers['Accept-Language'] = 'zh-CN'
            config.headers['Authorization'] = localStorage.getItem('usrToken') // 可以全局设置接口请求header中带token

            if (config.method === 'post') {
                if (!config.data) { // 没有参数时，config.data为null，需要转下类型
                    config.data = {}
                }
                // config.data = JSON.stringify(config.data) // qs序列化参数
            }
            return config
        },
        err => {
            //Promise.reject()方法返回一个带有拒绝原因的Promise对象，在F12的console中显示报错
            Promise.reject(err)
        }
    )

    //设置session和store
    let tmpStore = sessionStorage.getItem('store')
    if (tmpStore != null) {
        //encode mark.
        //if(session store格式错误) {提示错误 清空cookie、localStorage、store返回到登陆页面} 

        proxy.$store.replaceState(
            Object.assign({}, proxy.$store.state, JSON.parse(tmpStore))
        )
        //sessionStorage.removeItem('store')
    }

    //功能
    const router = useRouter()

    const changeNav = (value) => {
        //proxy.navValue = ref('dashborad')
        proxy.navValue = 'dashboard'
        //console.log(proxy.navValue, typeof ('dashboard'))
    }

    const changeHandler = (active) => {
        console.log('change', active);
    };

    let id = 0;
    const value = ref('panel/index');
    const panelData = ref([
        {
            value: 'panel/index',
            label: '仪表盘',
            removable: false,
            content: '原有选项卡1内容',
        },
    ]);

    const addTab = (obj) => {
        let b = false
        panelData.value.forEach(item => {
            if (item.value == obj.value) {
                b = true
            }
        })
        if (b) return
        let v = obj.value
        let l = obj.label
        panelData.value.push({
            value: v,
            label: l,
            //value: `${id}`,
            //label: `新选项卡${id}`,
            removable: true,
            content: '新选项卡内容',
        })
        value.value = `${v}`;
        router.replace('/' + `${v}`)
    };

    const suicide = () => {
        
    }

    /* 
     * 废弃函数 
    const updateRouter = () => {
        proxy.updateViewStatu = false
        setTimeout(() => {
            console.log('1')
            proxy.updateViewStatu = true
        }, 0)
        
    }
    */

    const removeTab = ({ value: val, index }) => {
        if (index < 0) return false;
        panelData.value.splice(index, 1);
        if (panelData.value.length === 0) return;
        if (value.value === val) {
            value.value = panelData.value[Math.max(index - 1, 0)].value;
        }
        router.replace('/' + value.value)
    }

    const onCangeTab = (value) => {
        router.replace('/' + value)
    }

    const clickHandler = () => {
        proxy.$MessagePlugin.success('退出登录')
        quit()
    }

    const quit = () => {
        proxy.$router.replace({ path: '/' });
        proxy.$utils.clearCookies()
        localStorage.clear()
        sessionStorage.clear()
    }

    //初始化
    if (proxy.$route.path != '/' + value.value) {
        let value = (window.location.pathname + window.location.search).slice(1)
        let label = ''
        let obj = { value, label }
        addTab(obj)
    }
    const avatarUrl = require('../img/defaultAvatar.png')
</script>
<script>
    export default {
        data() {
            return {
                options: [
                    { content: '退出登录', value: 1 },
                ],
                collapsed: false,
                updateViewStatu: true,
                navValue: ''
            }
        },
        methods: {
            makeCollapse() {
                this.collapsed = !this.collapsed;
            },
            debugMethod() {
                console.log(this.$store.state)
            },
            solveBeforeUnload(e) {
                //encode mark
                //proxy.$store.commit('updateUsrTabs', panelData)
                sessionStorage.setItem('store', JSON.stringify(this.$store.state))
            }
        },
        watch: {
            $route(to, from) {
                this.updateViewStatu = false
                setTimeout(() => {
                    this.updateViewStatu = true
                }, 0)
            }
        },
        mounted() {
            window.addEventListener('beforeunload', e => this.solveBeforeUnload(e))
            console.log('loaded successed!')
        },
        destroyed() {
            window.removeEventListener('beforeunload', e => this.solveBeforeUnload(e))
        }
    }
</script>
<style scoped>
    *{
        box-sizing:border-box;
    }
    .t-menu__operations  .t-button{
        margin-left: 8px;
    }

    .t-demo-menu--dark .t-button {
        color: #fff;
    }
    .t-demo-menu--dark .t-button:hover {
        background-color: #4b4b4b;
        border-color: transparent;
        --ripple-color: #383838;
    }
    .tdesign-starter-side-nav {
        position: fixed;
        top: 0;
        bottom: 0;
        z-index: 200;
        transition: all .3s;
        min-height: 100%;
    }
    /*
    .layer+*{
        padding: 15px;
    }
    */
</style>