<script setup lang="ts">
import { onMounted, ref, reactive, watch } from 'vue';

import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

import {
	getFirestore,
	collection,
	getDocs,
	doc,
	where,
	query,
	onSnapshot
} from 'firebase/firestore';
import { useRouter } from 'vue-router';
import { db } from '../../main';
import UserMenu from '../../components/UserMenu.vue';
import NavigationItem from '../../components/NavigationItem.vue';
import Table from '../../components/table/Table.vue';
import CreateForm from '../../components/modal/CreateForm.vue';
import CreateItemForm from '../../components/modal/CreateItemForm.vue';

const router = useRouter();

const currentUser = ref(null);
const name = ref(null);
const currentList = ref('');
const lists = ref([]);
const currentListItems = ref([]);
const participants = ref([]);
const subscription = ref(null);
const navigationIndex = ref(0);

const isLoggedIn = ref(false);

let auth;
onMounted(() => {
	auth = getAuth();
	onAuthStateChanged(auth, user => {
		if (user) {
			isLoggedIn.value = true;
			currentUser.value = user;
			name.value = currentUser.value.displayName;
			getLists();
		} else {
			isLoggedIn.value = false;
			currentUser.value = null;
			name.value = null;
		}
	});
});

watch(currentList, (newCurrentList, oldCurrentList) => {
	if (lists.value.length <= 0) {
		participants.value = [];
		return;
	}

	const findList = lists.value.find(list => list.id === newCurrentList);
	participants.value = findList === undefined ? [] : findList.data.participants;
});

const handleSignOut = () => {
	signOut(auth).then(() => {
		router.push('/');
	});
};

const getLists = () => {
	const listsCollection = collection(getFirestore(), 'lists');
	getDocs(listsCollection)
		.then(listsSnapshot => {
			return listsSnapshot.docs.map(list => {
				return { data: list.data(), id: list.id };
			});
		})
		.then(receivedLists => {
			lists.value = receivedLists;
			if (lists.value.length > 0) {
				getListItems(lists.value[0].id);
			}
		});
};

const getListItems = (id: string) => {
	currentList.value = id;
	if (subscription.value !== null) {
		subscription.value();
	}

	const itemsCollection = collection(getFirestore(), `lists/${id}/items`);

	subscription.value = onSnapshot(
		query(itemsCollection, where('deleted', '==', false)),
		querySnapshot => {
			const items = [];
			querySnapshot.forEach(doc => {
				items.push({ data: doc.data(), id: doc.id });
			});
			console.log({ items });
			currentListItems.value = items;
		}
	);
};
</script>

<template>
	<div class="flex flex-col h-screen bg-gray-100">
		<header
			class="flex items-center justify-between py-4 px-4 sm:px-6 lg:px-8 bg-white"
		>
			<div class="flex items-center space-x-4">
				<img
					class="h-8 w-8 flex-shrink-0"
					src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
					alt="Workflow"
				/>
				<span class="text-2xl text-gray-500 font-semibold">DIDIT</span>
			</div>
			<UserMenu v-bind:name="name" />
		</header>

		<main class="flex flex-1 min-h-0">
			<div class="flex flex-col w-[300px] bg-gray-800 p-2">
				<CreateForm v-bind:user="currentUser" />
				<ul class="overflow-y-auto">
					<NavigationItem
						v-for="(list, index) in lists"
						v-on:click="
							() => {
								getListItems(list.id);
								navigationIndex = index;
							}
						"
						v-bind:name="list.data.name"
						v-bind:active="navigationIndex === index"
					/>
				</ul>
			</div>

			<div class="flex flex-col flex-1 items-end max-w-full">
				<div class="flex justify-end bg-gray-800 w-full">
					<CreateItemForm
						v-bind:user="currentUser"
						v-bind:listId="currentList"
					/>
				</div>
				<Table
					class="py-6"
					v-bind:listId="currentList"
					v-bind:user="currentUser"
					v-bind:rows="currentListItems"
					v-bind:participants="participants"
				/>
			</div>
		</main>
	</div>
</template>
