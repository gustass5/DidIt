import {
	GoogleAuthProvider,
	getRedirectResult,
	signInWithRedirect
} from 'firebase/auth';
import { FirebaseClient } from '~/firebase/client/firebase.client';

import { ActionFunction, redirect, LoaderArgs, json } from '@remix-run/node';

import { useEffect } from 'react';
import { useSubmit } from '@remix-run/react';
import { Session } from '~/sessions';
import { FirebaseServer } from '~/firebase/server/firebase.server';
import { UserSchema } from '~/schema/Schema';
import { ActionError } from '~/errors/ActionError';
import { Alert } from '~/components/Alert/Alert';
import { useAlerts } from '~/components/Alert/useAlerts';
import { ZodError } from 'zod';

export const loader = async ({ request }: LoaderArgs) => {
	try {
		const user = await Session.isUserSessionValid(request);

		if (user) {
			return redirect('/lists');
		}

		return null;
	} catch (error: unknown) {
		throw new Error('Unexpected error happened');
	}
};

export const action: ActionFunction = async ({ request }) => {
	try {
		const formData = await request.formData();

		const idToken = formData.get('idToken');

		if (idToken === null || typeof idToken !== 'string') {
			throw new ActionError('Invalid id token');
		}

		// Verify id token, error will be thrown if it is not valid
		const verifiedUser = await FirebaseServer.auth.verifyIdToken(idToken);

		const user = UserSchema.parse({
			id: verifiedUser.uid,
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
	} catch (error: unknown) {
		if (error instanceof ZodError) {
			return json({
				notification: {
					type: 'error',
					title: 'Error',
					text: 'Invalid input'
				}
			});
		}

		if (error instanceof ActionError) {
			return json({
				notification: { type: 'error', title: 'Error', text: error.message }
			});
		}

		return json({
			notification: {
				type: 'error',
				title: 'Error',
				text: 'Unexpected error ocurred'
			}
		});
	}
};

export default function Index() {
	const submit = useSubmit();

	useAlerts();

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
					Alert.fire({
						icon: 'error',
						title: 'Error',
						text: 'No id token was found'
					});
					return;
				}

				submit({ idToken }, { method: 'post' });
			} catch (error: any) {
				Alert.fire({
					icon: 'error',
					title: 'Error',
					text: 'Unexpected error occurred'
				});
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
