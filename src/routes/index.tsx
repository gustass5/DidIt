import {
	GoogleAuthProvider,
	getRedirectResult,
	signInWithRedirect
} from 'firebase/auth';
import { FirebaseClient } from '~/firebase/client/firebase.client';

import { ActionFunction, redirect } from '@remix-run/node';

import { useEffect } from 'react';
import { useSubmit } from '@remix-run/react';
import { Session } from '~/sessions';
import { FirebaseServer } from '~/firebase/server/firebase.server';
import { UserSchema } from '~/schema/Schema';

export const loader = async () => {
	return null;
};

export const action: ActionFunction = async ({ request }) => {
	const formData = await request.formData();

	const idToken = formData.get('idToken');

	if (idToken === null || typeof idToken !== 'string') {
		throw new Error('Invalid id token');
	}

	// Verify id token, error will be thrown if it is not valid
	const verifiedUser = await FirebaseServer.auth.verifyIdToken(idToken);

	const user = UserSchema.parse({
		name: verifiedUser.name,
		email: verifiedUser.email,
		image: verifiedUser.picture
	});

	// Set user in the database, user will be created if it does not exist or overwritten if it does
	await FirebaseServer.database.doc(`users/${verifiedUser.uid}`).set(user);

	return redirect('/lists', {
		headers: {
			'Set-Cookie': await Session.setUserSession(idToken, request)
		}
	});
};

export default function Index() {
	const submit = useSubmit();

	const handleClickRedirect = () => {
		const auth = FirebaseClient.auth;
		const provider = new GoogleAuthProvider();
		signInWithRedirect(auth, provider);
	};

	useEffect(() => {
		const loadRedirectResult = async () => {
			const auth = FirebaseClient.auth;

			try {
				const result = await getRedirectResult(auth);

				if (result === null) {
					// Don't show any error here, because this page can be loaded from in-app redirect or in other way without having result
					return;
				}

				const idToken = await result.user.getIdToken(true);

				if (idToken === undefined) {
					throw new Error('No id token was found');
				}

				submit({ idToken }, { method: 'post' });
			} catch (error: any) {
				// [TODO]: Implement error handling
				console.error('err', error);
			}
		};

		loadRedirectResult();
	}, []);

	return (
		<div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.4' }}>
			<h1>Welcome to Remix</h1>
			<ul className="bg-red-500">
				<li>
					<a
						target="_blank"
						href="https://remix.run/tutorials/blog"
						rel="noreferrer"
					>
						15m Quickstart Blog Tutorial
					</a>
				</li>
				<li>
					<a
						target="_blank"
						href="https://remix.run/tutorials/jokes"
						rel="noreferrer"
					>
						Deep Dive Jokes App Tutorial
					</a>
				</li>
				<li>
					<a target="_blank" href="https://remix.run/docs" rel="noreferrer">
						Remix Docs
					</a>
				</li>
			</ul>
			<button onClick={() => handleClickRedirect()}>Login with Google</button>
		</div>
	);
}
