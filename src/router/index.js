import Vue from 'vue'
import Router from 'vue-router'

// import Hello from '@/components/Hello'
import SheltersIndex from '@/components/shelters/Index'
import SheltersShow from '@/components/shelters/Show'

Vue.use(Router)

export default new Router({
	routes: [
		{
			path: '/',
			name: 'SheltersIndex',
			component: SheltersIndex,
			children: [
				{
					path: ':id',
					name: 'SheltersShow',
					component: SheltersShow,
					props: true
				}
			]
		},
		{ path: '*', redirect: '/shelters' }
	]
})
