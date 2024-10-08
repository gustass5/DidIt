import React from 'react';
import { useLocation, useMatches } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/node';
import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration
} from '@remix-run/react';
import styles from '~/styles/app.css';
let isMount = true;
export function links() {
	return [{ rel: 'stylesheet', href: styles }];
}
export const meta: MetaFunction = () => ({
	charset: 'utf-8',
	title: 'DIDIT',
	viewport: 'width=device-width,initial-scale=1'
});
export default function App() {
	let location = useLocation();
	let matches = useMatches();

	React.useEffect(() => {
		let mounted = isMount;
		isMount = false;
		if ('serviceWorker' in navigator) {
			if (navigator.serviceWorker.controller) {
				navigator.serviceWorker.controller?.postMessage({
					type: 'REMIX_NAVIGATION',
					isMount: mounted,
					location,
					matches,
					manifest: window.__remixManifest
				});
			} else {
				let listener = async () => {
					await navigator.serviceWorker.ready;
					navigator.serviceWorker.controller?.postMessage({
						type: 'REMIX_NAVIGATION',
						isMount: mounted,
						location,
						matches,
						manifest: window.__remixManifest
					});
				};
				navigator.serviceWorker.addEventListener('controllerchange', listener);
				return () => {
					navigator.serviceWorker.removeEventListener(
						'controllerchange',
						listener
					);
				};
			}
		}
	}, [location]);

	return (
		<html lang="en">
			<head>
				<Meta />
				<link rel="manifest" href="/resources/manifest.webmanifest" />
				<Links />
			</head>
			<body className="flex h-screen bg-gray-950">
				<Outlet />
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	);
}
