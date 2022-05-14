export const routes = [
	{ path: '/', component: () => import('../../Pages/Unauthorized/Login.vue') },
	{
		path: '/dashboard',
		component: () => import('../../Pages/Authorized/Dashboard.vue')
	}
];
