import {
	GoogleAuthProvider,
	getRedirectResult,
	signInWithRedirect
} from 'firebase/auth';
import { FirebaseClient } from '~/firebase/client/firebase.client';

import { ActionFunction, redirect, LoaderArgs, json } from '@remix-run/node';

import { useEffect, useState } from 'react';
import { useSubmit } from '@remix-run/react';
import { Session } from '~/sessions';
import { FirebaseServer } from '~/firebase/server/firebase.server';
import { UserSchema } from '~/schema/Schema';
import { ActionError } from '~/errors/ActionError';
import { Alert } from '~/components/Alert/Alert';
import { useAlerts } from '~/components/Alert/useAlerts';
import { ZodError } from 'zod';
import { Logo } from '~/components/Logo/Logo';

import { useCallback } from 'react';
import Particles from 'react-particles';
import type { Container, Engine } from 'tsparticles-engine';

import { loadSlim } from 'tsparticles-slim';

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
	const [loading, setLoading] = useState(false);

	const submit = useSubmit();

	useAlerts();

	const handleClickRedirect = () => {
		setLoading(true);
		const auth = FirebaseClient.auth;
		const provider = new GoogleAuthProvider();
		signInWithRedirect(auth, provider);
	};

	useEffect(() => {
		const loadRedirectResult = async () => {
			setLoading(true);

			const auth = FirebaseClient.auth;

			try {
				const result = await getRedirectResult(auth);

				if (result === null) {
					setLoading(false);
					// Don't show any error here, because this page can be loaded from in-app redirect or in other way without having result
					return;
				}
				setLoading(true);

				const idToken = await result.user.getIdToken(true);

				if (idToken === undefined) {
					setLoading(false);
					Alert.fire({
						icon: 'error',
						title: 'Error',
						text: 'No id token was found'
					});
					return;
				}

				submit({ idToken }, { method: 'post' });
			} catch (error: any) {
				setLoading(false);

				Alert.fire({
					icon: 'error',
					title: 'Error',
					text: 'Unexpected error occurred'
				});
			}
		};

		loadRedirectResult();
	}, []);

	const particlesInit = useCallback(async (engine: Engine) => {
		await loadSlim(engine);
	}, []);

	const particlesLoaded = useCallback(async (container: Container | undefined) => {},
	[]);

	return (
		<div
			className="flex flex-col h-full w-full items-center justify-center"
			style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.4' }}
		>
			<Particles
				id="tsparticles"
				className="w-full h-screen absolute z-0"
				init={particlesInit}
				loaded={particlesLoaded}
				options={{
					background: {
						color: {
							value: '#121212'
						}
					},
					fpsLimit: 60,
					interactivity: {
						detectsOn: 'canvas',
						events: {
							onClick: {
								enable: false
							},
							onHover: {
								enable: false,
								mode: 'repulse'
							},
							resize: true
						}
					},
					particles: {
						color: {
							value: '#fb923c'
						},
						links: {
							enable: false
						},
						collisions: {
							enable: true
						},
						move: {
							direction: 'top',
							enable: true,
							outMode: 'out',
							random: true,
							speed: 1,
							straight: false
						},
						number: {
							density: {
								enable: true,
								value_area: 125
							},
							value: 6
						},
						opacity: {
							value: 0.65,
							random: true
						},
						shape: {
							type: 'triangle'
						},
						size: {
							random: true,
							value: 5
						}
					},
					detectRetina: true
				}}
			/>
			<div className="fixed inset-0 flex flex-col items-center justify-center">
				<div className="flex items-center  justify-center px-4 text-2xl font-semibold text-orange-400 mb-4">
					<Logo /> <span>DIDIT</span>
				</div>
				<button
					disabled={loading}
					className="p-3 uppercase font-semibold border rounded text-orange-400 border-orange-400 hover:bg-orange-400 hover:text-black"
					onClick={() => handleClickRedirect()}
				>
					{loading ? 'Loading...' : 'Login with Google'}
				</button>
			</div>
		</div>
	);
}
