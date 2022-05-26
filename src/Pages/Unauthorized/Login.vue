<script setup lang="ts">
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useRouter } from 'vue-router';

const router = useRouter();

async function handleClick() {
	const provider = new GoogleAuthProvider();
	const response = await signInWithPopup(getAuth(), provider);
	router.push('/dashboard');
}
</script>
<template>
	<div class="flex items-center justify-center h-screen bg-amber-300">
		<main class="flex flex-col justify-end rounded w-1/4 h-1/4 bg-amber-500/60 text-white">
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
					focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
				"
			>
				Sign in
			</button>
		</main>
	</div>
</template>
