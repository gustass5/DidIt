import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './routes';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const router = createRouter({
	history: createWebHistory(),
	routes
});

const getCurrentUser = () => {
	return new Promise((resolve, reject) => {
		const removeListener = onAuthStateChanged(
			getAuth(),
			user => {
				removeListener();
				resolve(user);
			},
			reject
		);
	});
};

router.afterEach(async (to, from, next) => {
	if (to.matched.some(record => record.meta.requiresAuth)) {
		if (await getCurrentUser()) {
			// next();
		} else {
			// next("/")
		}
	} else {
		// next();
	}
});

export default router;
