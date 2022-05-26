<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

import { getFirestore, collection, getDocs, where } from 'firebase/firestore';
import { useRouter } from 'vue-router';
import { db } from '../../main';
import UserMenu from '../../components/UserMenu.vue';
import NavigationItem from '../../components/NavigationItem.vue';
import Table from '../../components/table/Table.vue';

const router = useRouter();

const currentUser = ref(null);
const lists = ref([]);

const isLoggedIn = ref(false);

let auth;
onMounted(() => {
	auth = getAuth();
	onAuthStateChanged(auth, user => {
		if (user) {
			isLoggedIn.value = true;
			currentUser.value = user;
			getLists();
		} else {
			isLoggedIn.value = false;
			currentUser.value = null;
		}
	});
});

const handleSignOut = () => {
	signOut(auth).then(() => {
		router.push('/');
	});
};
const getLists = () => {
	const listsCollection = collection(getFirestore(), 'lists');
	getDocs(
		listsCollection,
		where('participants', 'array-contains', currentUser.value.uid)
	)
		.then(listsSnapshot => {
			return listsSnapshot.docs.map(list => list.data());
		})
		.then(receivedLists => {
			lists.value = receivedLists;
			getDocs();
		});
};
</script>

<template>
	<div class="flex flex-col min-h-full bg-gray-100">
		<header
			class="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 bg-white"
		>
			<div class="flex items-center space-x-4">
				<img
					class="h-8 w-8 flex-shrink-0"
					src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
					alt="Workflow"
				/>
				<span class="text-2xl text-gray-500 font-semibold">DIDIT</span>
			</div>
			<UserMenu />
		</header>

		<main class="flex flex-1 h-full">
			<nav class="w-[300px] bg-gray-800">
				<ul class="flex flex-col">
					<NavigationItem v-for="list in lists" v-bind:name="list.name" />
				</ul>
			</nav>
			<div class="flex-1 py-6 sm:px-6 lg:px-8">
				<Table />
			</div>
		</main>
	</div>
</template>
