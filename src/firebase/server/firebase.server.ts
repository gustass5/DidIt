import {
	getApp as getServerApp,
	getApps as getServerApps,
	initializeApp as initializeServerApp,
	cert as serverCert
} from 'firebase-admin/app';

import { getAuth as getServerAuth } from 'firebase-admin/auth';

if (getServerApps().length === 0) {
	if (!process.env.SERVICE_ACCOUNT) {
		throw new Error('Missing SERVICE_ACCOUNT environment variable');
	}

	try {
		const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT);

		const config = {
			credential: serverCert(serviceAccount)
		};

		initializeServerApp(config);
	} catch {
		throw Error('Invalid SERVICE_ACCOUNT environment variable');
	}
}

const auth = getServerAuth(getServerApp());

export const FirebaseServer = {
	auth
};
