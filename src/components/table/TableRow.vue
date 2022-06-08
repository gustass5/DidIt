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
	participants: any[];
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
	const name = props.participants.find(
		participant => Object.keys(participant)[0] === key
	);
	const innitials = name[key].split(' ')[0][0] + name[key].split(' ')[1][0];
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
	<tr key="{id}" class="h-[59px]">
		<td class="whitespace-nowrap px-4 text-sm sm:px-6 text-gray-900">
			<input type="checkbox" />
		</td>
		<td class="px-4 text-sm sm:px-6 text-gray-900">{{ props.data.content }}</td>
		<td class="px-4 text-sm sm:px-6 text-gray-900"></td>
		<td class="px-4 text-sm sm:px-6 text-gray-900">
			<div class="flex -space-x-1 overflow-hidden">
				<img
					v-for="user in responsibleUsers"
					class="inline-block h-6 w-6 rounded-full ring-2 ring-white"
					v-bind:src="getUserImage(user)"
					v-bind:alt="user"
				/>
			</div>
		</td>
		<td v-if="!isUserResponsible" class="px-4 text-sm sm:px-6">
			<button v-on:click="becomeResponsible">Become responsible</button>
		</td>
		<td v-else class="px-4 text-sm sm:px-6">
			<label>Mark as done: <input v-model="isChecked" type="checkbox" /></label
			><button v-on:click="cancelResponsibility">| Leave</button>
		</td>
		<td>
			<XIcon
				v-on:click="deleteItem"
				class="h-5 w-5 m-1 cursor-pointer hover:text-orange-800"
			/>
		</td>
		<td class="w-[0.1%]" />
	</tr>
</template>
