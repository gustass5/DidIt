<script setup lang="ts">
import {
	doc,
	getFirestore,
	updateDoc,
	arrayUnion,
	arrayRemove
} from 'firebase/firestore';
import { XIcon } from '@heroicons/vue/solid';

import { ref, computed, watch } from 'vue';
import { onMounted } from 'vue';

const props = defineProps<{
	listId: string;
	id: string;
	data: any;
	user: any | null;
	participants: any | null;
	label?: string;
}>();
/**
 * Is item/task completed
 */
const isChecked = ref(false);

const isUserResponsible = computed(() => {
	return (
		props.data.responsible[props.user.uid] !== undefined &&
		props.data.responsible[props.user.uid] !== null
	);
});

watch(isChecked, async (newIsChecked, oldIsChecked) => {
	await handleCheckbox(newIsChecked);
});

const handleCheckbox = async (checked: boolean) => {
	if (checked) {
		await markAsDone();
		return;
	}
	await becomeResponsible();
};

const responsibleUsers = computed(() => {
	if (props.data.responsible === null || props.data.responsible === undefined) {
		return [];
	}

	return Object.keys(props.data.responsible).reduce((responsibleUsers, key) => {
		if (props.data.responsible[key] !== null) {
			return [...responsibleUsers, { [key]: props.data.responsible[key] }];
		}

		return responsibleUsers;
	}, []);
});

onMounted(() => {});

/**
 * Every items has `responsible` object
 * If user decided to become responsible for the task we add its uid to the object with value false
 * Each value of `responsible` objectj can be in one of three states:
 * false - if user has not completed the task yet
 * true - If user has completed the task
 * null - If user no longers want to be responsible (We do not remove it from the object out of convenience)
 */

const becomeResponsible = async () => {
	const itemRef = doc(getFirestore(), `lists/${props.listId}/items/${props.id}`);

	await updateDoc(itemRef, {
		[`responsible.${props.user.uid}`]: false
	});
};

const markAsDone = async () => {
	const itemRef = doc(getFirestore(), `lists/${props.listId}/items/${props.id}`);

	await updateDoc(itemRef, {
		[`responsible.${props.user.uid}`]: true
	});
};

const cancelResponsibility = async () => {
	const itemRef = doc(getFirestore(), `lists/${props.listId}/items/${props.id}`);

	await updateDoc(itemRef, {
		[`responsible.${props.user.uid}`]: null
	});
};

const getUserImage = (user: any) => {
	const key = Object.keys(user)[0];
	const name = props.participants[key];
	const innitials = name.split(' ')[0][0] + name.split(' ')[1][0];
	return `https://avatars.dicebear.com/api/initials/${innitials}.svg`;
};

const deleteItem = async () => {
	const itemRef = doc(getFirestore(), `lists/${props.listId}/items/${props.id}`);
	await updateDoc(itemRef, {
		[`deleted`]: true
	});
};
</script>

<template>
	<tr
		key="{id}"
		v-bind:class="{
			'h-[59px] transition ease-in-out duration-500': true,
			'bg-blue-50': isUserResponsible,
			'bg-green-50': isUserResponsible && isChecked
		}"
	>
		<td class="whitespace-nowrap px-4 text-sm sm:px-6 text-gray-900">
			<input type="checkbox" />
		</td>
		<td class="px-4 text-sm sm:px-6 text-gray-700">{{ props.data.content }}</td>
		<td class="px-4 text-sm sm:px-6 text-gray-900"></td>
		<td class="px-4 text-sm sm:px-6 text-gray-900">
			<div class="flex -space-x-1 overflow-hidden p-1">
				<img
					v-for="user in responsibleUsers"
					v-bind:class="{
						'inline-block h-8 w-8 rounded-full ring-1': true,
						'ring-green-500': Object.values(user)[0],
						' ring-transparent': !Object.values(user)[0]
					}"
					v-bind:src="getUserImage(user)"
					alt="userImage"
				/>
			</div>
		</td>
		<td class="px-4 text-sm sm:px-6 text-gray-700 text-center">
			{{ props.data.creation_date.split('T')[0] }}
		</td>
		<td
			v-if="!isUserResponsible"
			class="text-right text-orange-600 px-4 text-sm sm:px-6"
		>
			<button
				class="hover:text-blue-500 pr-20 font-medium"
				v-on:click="becomeResponsible"
			>
				Become responsible
			</button>
		</td>
		<td v-else class="text-right text-gray-700 px-4 text-sm sm:px-6 space-x-3">
			<label
				class="
					hover:text-green-500
					text-orange-600
					cursor-pointer
					space-x-2
					font-medium
				"
			>
				<input
					class="cursor-pointer accent-green-500"
					v-model="isChecked"
					type="checkbox"
				/>
				<span>Mark as done</span>
			</label>
			<button
				class="
					hover:text-red-900
					text-red-600 text-orange-600 text-medium
					font-medium
				"
				v-on:click="cancelResponsibility"
			>
				Leave
			</button>
			<button
				class="
					hover:text-red-900
					text-red-600 text-medium
					font-medium
					m-1
					cursor-pointer
				"
				v-on:click="deleteItem"
			>
				Delete
			</button>
		</td>

		<td class="w-[0.1%]" />
	</tr>
</template>
