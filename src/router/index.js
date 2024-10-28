import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import NotFound from '../views/NotFound.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Panel from '../views/workPanel.vue'
import pHome from '../views/Panel/panelHome.vue'
import pConfig from '../views/Panel/panelConfig.vue'
import pGroup from '../views/Panel/panelGroups.vue'
import pPost from '../views/Panel/panelPost.vue'
import pMessage from '../views/Panel/panelMessage.vue'
import pDetailMsg from '../views/Panel/panelDetailMsg.vue'
import pPlugins from '../views/Panel/panelPlugins.vue'
import p404 from '../views/404.vue'

const router = createRouter({
	history: createWebHistory(),
	routes: [
		/*{
			path: '/',
			redirect: '/homePage',
		},*/
		{
			path: '/',
			name: 'login',
			component: HomePage
		},
		{
			path: '/404',
			name: 'page404',
			component: p404
		},
		{ path: '/login', component: Login, hidden: true },
		{ path: '/register', component: Register, hidden: true },
		{
			path: '/panel',
			component: Panel,
			hidden: true,
			redirect: '/panel/index',
			children: [
				{
					path: 'index',
					name: 'pHome',
					component: pHome,
					hidden: true
				},
				{
					path: 'config',
					name: 'pConfig',
					component: pConfig,
					hidden: true
				},
				{
					path: 'groups',
					name: 'pGroup',
					component: pGroup,
					hidden: true
				},
				{
					path: 'post',
					name: 'pPost',
					component: pPost,
					hidden: true
				},
				{
					path: 'message',
					name: 'pMessage',
					component: pMessage,
					hidden: true
				},
				{
					path: 'dm',
					name: 'pDetailMsg',
					component: pDetailMsg,
					hidden: true
				}, 
				{
					path: 'plugins',
					name: 'pPlugins',
					component: pPlugins,
					hidden: true
                }
			]
		}
	]
})

export default router;