<script setup lang="ts">
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
	apiKey: import.meta.env.VITE_APP_API_KEY,
	authDomain: import.meta.env.VITE_APP_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_APP_PROJECT_ID,
	storageBucket: import.meta.env.VITE_APP_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_APP_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_APP_APP_ID,
	measurementId: import.meta.env.VITE_APP_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();
const auth = getAuth();

async function handleClick() {
	const response = await signInWithPopup(auth, provider);
	console.log(response, GoogleAuthProvider.credentialFromResult(response));
}
</script>
<template>
	<div class="flex items-center justify-center h-screen bg-amber-300">
		<main
			class="
				flex flex-col
				justify-end
				rounded
				w-1/4
				h-1/4
				bg-amber-500/60
				text-white
			"
		>
			<div class="flex flex-1 items-center justify-center text-5xl">
				<div>DID IT</div>
			</div>
			<button
				v-on:click="handleClick"
				class="
					py-2
					px-4
					border border-transparent
					text-md
					font-medium
					rounded-b-md
					bg-amber-500
					hover:bg-amber-500/70
					focus:outline-none
					focus:ring-2
					focus:ring-offset-2
					focus:ring-indigo-500
				"
			>
				Sign in
			</button>
		</main>
	</div>
</template>
