<script setup lang="ts">
import { ref } from 'vue';
import {
	Dialog,
	DialogPanel,
	DialogTitle,
	DialogDescription,
	TransitionRoot,
	TransitionChild
} from '@headlessui/vue';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import XIcon from '@heroicons/vue/solid/XIcon';

const props = defineProps<{ user: any | null }>();

const isOpen = ref(false);
const name = ref('');

const setIsOpen = value => {
	isOpen.value = value;
};

const onSubmit = async event => {
	event.preventDefault();
	const docRef = await addDoc(collection(getFirestore(), 'lists'), {
		name: name.value,
		author_id: props.user.uid,
		author_name: props.user.displayName,
		participants: [{ [props.user.uid]: props.user.displayName }],
		invitations: [],
		deleted: false,
		creation_date: new Date().toISOString()
	});
	setIsOpen(false);
};
</script>

<template>
	<TransitionRoot appear :show="isOpen" as="template">
		<Dialog :open="isOpen" @close="setIsOpen" class="relative z-50">
			<div class="fixed inset-0 flex items-center justify-center">
				<TransitionChild
					as="template"
					enter="duration-300 ease-out"
					enter-from="opacity-0 scale-95"
					enter-to="opacity-100 scale-100"
					leave="duration-200 ease-in"
					leave-from="opacity-100 scale-100"
					leave-to="opacity-0 scale-95"
				>
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
							class="
								w-full
								text-center text-2xl text-gray-600
								mb-4
								font-semibold
							"
						>
							CREATE NEW LIST
						</span>
						<form
							class="flex flex-col items-center justify-center space-y-4"
							v-on:submit="onSubmit($event)"
						>
							<label class="flex flex-col w-full">
								<span class="text-gray-500 text-sm">Name</span>
								<input
									class="border outline-none text-gray-700"
									type="text"
									v-model="name"
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
				</TransitionChild>
			</div>
		</Dialog>
	</TransitionRoot>
	<button
		class="
			flex
			items-center
			justify-center
			w-full
			bg-orange-600
			hover:bg-orange-700
			text-white text-xl
			cursor-pointer
			rounded-md
			font-medium
			p-3
		"
		v-on:click="setIsOpen(true)"
	>
		<span>CREATE</span>
	</button>
</template>
