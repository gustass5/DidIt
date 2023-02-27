import { createCookieSessionStorage } from '@remix-run/node';
import { FirebaseServer } from './firebase/server/firebase.server';
import { UserSchema, UserType } from './schema/Schema';

const USER_SESSION_KEY = 'userToken';

const COOKIE_AGE = 1000 * 60 * 60 * 24 * 7; // 1 week

const { getSession, commitSession, destroySession } = createCookieSessionStorage({
	cookie: {
		name: '__session',
		secrets: ['secret'],
		maxAge: COOKIE_AGE,
		sameSite: 'lax',
		path: '/',
		httpOnly: true
	}
});

const getCurrentSession = async (request: Request) =>
	await getSession(request.headers.get('Cookie'));

const getUserToken = async (request: Request) => {
	const session = await getCurrentSession(request);

	return session.get(USER_SESSION_KEY);
};

const setUserSession = async (idToken: string, request: Request) => {
	const session = await getCurrentSession(request);

	const sessionCookie = await FirebaseServer.auth.createSessionCookie(idToken, {
		expiresIn: COOKIE_AGE
	});

	session.set(USER_SESSION_KEY, sessionCookie);

	return await commitSession(session);
};

/**
 * @returns If user session is valid, returns user data, otherwise null.
 */
const isUserSessionValid = async (request: Request): Promise<UserType | null> => {
	const token = await getUserToken(request);

	try {
		const verifiedUser = await FirebaseServer.auth.verifySessionCookie(token, true);

		const user = UserSchema.parse({
			id: verifiedUser.uid,
			name: verifiedUser.name,
			email: verifiedUser.email,
			image: verifiedUser.picture
		});

		return user;
	} catch (error: any) {
		// [TODO]: Handle error
		console.log('error', error);
		return null;
	}
};

export const Session = {
	getSession: getCurrentSession,
	destroySession,
	getUserToken,
	setUserSession,
	isUserSessionValid
};
