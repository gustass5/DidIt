import { createApp } from 'vue';
import App from './App.vue';
import './index.css';
import router from './core/routes/router';

import { initializeApp } from 'firebase/app';
const firebaseConfig = {
	apiKey: import.meta.env.VITE_APP_API_KEY,
	authDomain: import.meta.env.VITE_APP_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_APP_PROJECT_ID,
	storageBucket: import.meta.env.VITE_APP_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_APP_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_APP_APP_ID,
	measurementId: import.meta.env.VITE_APP_MEASUREMENT_ID
};

initializeApp(firebaseConfig);

const app = createApp(App);
app.use(router);

app.mount('#app');
