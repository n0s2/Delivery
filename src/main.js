import { createApp } from 'vue'
import { useStore } from 'vuex'
import TDesign, { MessagePlugin } from 'tdesign-vue-next';
import App from './App.vue'
import router from './router/index.js'
import 'tdesign-vue-next/es/style/index.css';
import Axios from 'axios';
import '@/permission' // х╗оч
import store from './store/store.js';
import utils from '@/utils/index.js'
const app = createApp(App)

app.config.warnHandler = (msg, instance, trace) => { }
app.config.globalProperties.$store = useStore();
//Axios.defaults.baseURL = 'http://localhost:3000/';

app.config.globalProperties.$http = Axios;
app.config.globalProperties.$utils = utils;
app.config.globalProperties.$MessagePlugin = MessagePlugin
app.use(TDesign)
app.use(store)
app.use(router)
app.mount('#app')
