<script setup lang="ts">
import { ref } from 'vue';
import { Dialog, DialogPanel, DialogTitle, DialogDescription } from '@headlessui/vue';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { XIcon } from '@heroicons/vue/solid';

const props = defineProps<{ user: any | null; listId: string }>();

const isOpen = ref(false);
const content = ref('');

const setIsOpen = value => {
	isOpen.value = value;
};

const onSubmit = async event => {
	event.preventDefault();
	const docRef = await addDoc(
		collection(getFirestore(), `lists/${props.listId}/items`),
		{
			author_id: props.user.uid,
			author_name: props.user.displayName,
			content: content.value,
			responsible: {},
			deleted: false,
			creation_date: new Date().toISOString()
		}
	);
	setIsOpen(false);
};
</script>

<template>
	<Dialog :open="isOpen" @close="setIsOpen" class="relative z-50">
		<div class="fixed inset-0 flex items-center justify-center">
			<DialogPanel
				class="
					flex flex-col
					w-full
					max-w-sm
					rounded
					bg-white
					p-4
					rounded
					shadow-sm
				"
			>
				<button
					class="flex items-center justify-end px-4"
					@click="setIsOpen(false)"
				>
					<XIcon class="h-5 w-5 text-black hover:text-gray-500" />
				</button>
				<span
					class="w-full text-center text-2xl text-gray-600 mb-4 font-semibold"
				>
					CREATE NEW LIST ITEM
				</span>
				<form
					class="flex flex-col items-center justify-center space-y-4"
					v-on:submit="onSubmit($event)"
				>
					<label class="flex flex-col w-full">
						<span class="text-gray-500 text-sm">Content</span>
						<input
							class="border outline-none text-gray-700"
							type="text"
							v-model="content"
						/>
					</label>
					<button
						class="
							w-full
							border
							p-2
							rounded-md
							bg-orange-500
							text-white
							font-semibold
						"
						type="submit"
					>
						CREATE
					</button>
				</form>
			</DialogPanel>
		</div>
	</Dialog>
	<button
		class="
			flex
			text-white
			bg-orange-600
			hover:bg-orange-700
			p-4
			m-2
			rounded-md
			cursor-pointer
		"
		v-on:click="setIsOpen(true)"
	>
		Add Item
	</button>
</template>
