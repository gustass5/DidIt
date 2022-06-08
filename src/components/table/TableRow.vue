<script setup lang="ts">
import {
	doc,
	getFirestore,
	updateDoc,
	arrayUnion,
	arrayRemove
} from 'firebase/firestore';
import { ref, computed, watch } from 'vue';

const props = defineProps<{
	listId: string;
	id: string;
	data: any;
	user: any | null;
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
	console.log({ checked });
	if (checked) {
		await markAsDone();
		return;
	}
	await becomeResponsible();
};

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
</script>

<template>
	<tr key="{id}" class="h-[59px]">
		<td class="whitespace-nowrap px-4 text-sm sm:px-6 text-gray-900">
			<input type="checkbox" />
		</td>
		<td class="px-4 text-sm sm:px-6 text-gray-900">{{ props.data.content }}</td>
		<td class="px-4 text-sm sm:px-6 text-gray-900">Important</td>
		<td class="px-4 text-sm sm:px-6 text-gray-900">
			<div class="flex -space-x-1 overflow-hidden">
				<img
					class="inline-block h-6 w-6 rounded-full ring-2 ring-white"
					src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
					alt=""
				/>
				<img
					class="inline-block h-6 w-6 rounded-full ring-2 ring-white"
					src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
					alt=""
				/>
				<img
					class="inline-block h-6 w-6 rounded-full ring-2 ring-white"
					src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
					alt=""
				/>
				<img
					class="inline-block h-6 w-6 rounded-full ring-2 ring-white"
					src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
					alt=""
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
	</tr>
</template>
