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
const participants = ref(null);
const subscription = ref(null);
const listSubscription = ref(null);
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
	participants.value = findList === undefined ? null : findList.data.participants;
});

const getLists = () => {
	if (listSubscription.value !== null) {
		listSubscription.value();
	}

	const listsCollection = collection(getFirestore(), 'lists');

	listSubscription.value = onSnapshot(listsCollection, querySnapshot => {
		const listsArray = [];
		querySnapshot.forEach(doc => {
			listsArray.push({ data: doc.data(), id: doc.id });
		});
		lists.value = listsArray;
		if (lists.value.length > 0) {
			getListItems(lists.value[0].id);
			navigationIndex.value = 0;
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
			currentListItems.value = items;
		}
	);
};
</script>

<template>
	<div class="flex flex-col h-screen bg-gray-100">
		<header
			class="
				flex
				items-center
				justify-between
				py-4
				px-4
				sm:px-6
				lg:px-8
				bg-gray-800
			"
		>
			<div class="flex items-center space-x-4">
				<img
					class="h-8 w-8 flex-shrink-0"
					src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
					alt="Workflow"
				/>
				<span class="text-2xl text-gray-300 font-semibold">DIDIT</span>
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
				<div class="flex bg-white w-full">
					<div
						className="flex items-center justify-between w-full border-b border-gray-200"
					>
						<div className="flex-1 px-4 py-4 sm:space-y-1 sm:px-6 sm:py-5">
							<h3 className="text-lg font-medium leading-6 text-gray-900">
								{{ lists[navigationIndex]?.data.name }}
							</h3>
							<!-- <p className="text-sm text-gray-500">Description</p> -->
						</div>

						<div className="flex items-center space-x-3 pr-4">
							<CreateItemForm
								v-bind:user="currentUser"
								v-bind:listId="currentList"
							/>
						</div>
					</div>
				</div>

				<div
					class="
						flex
						w-full
						h-full
						flex-col flex-1
						bg-white
						shadow
						lg:rounded-md
					"
				>
					<div class="p-2">
						<Table
							class="py-6"
							v-bind:listId="currentList"
							v-bind:user="currentUser"
							v-bind:rows="currentListItems"
							v-bind:participants="participants"
						/>
					</div>
				</div>
			</div>
		</main>
	</div>
</template>
