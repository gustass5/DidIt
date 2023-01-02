import {
	getApp as getClientApp,
	getApps as getClientApps,
	initializeApp as initializeClintApp
} from 'firebase/app';

import { getAuth as getClientAuth } from 'firebase/auth';

const firebaseConfig = {
	apiKey: 'AIzaSyDDb2oUut9lv5AwDL1c1l5rRyfxy3VT3SQ',
	authDomain: 'whobringswhat.firebaseapp.com',
	projectId: 'whobringswhat',
	storageBucket: 'whobringswhat.appspot.com',
	messagingSenderId: '119486400038',
	appId: '1:119486400038:web:96b845aa977885d78e08e7',
	measurementId: 'G-76C5FHHFLT'
};

if (getClientApps().length === 0) {
	initializeClintApp(firebaseConfig);
}

const auth = getClientAuth(getClientApp());

export const FirebaseClient = {
	auth
};
