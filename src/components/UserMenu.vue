<script setup lang="ts">
import { BellIcon, MenuIcon, XIcon } from '@heroicons/vue/outline';
import {
	Disclosure,
	DisclosureButton,
	DisclosurePanel,
	Menu,
	MenuButton,
	MenuItem,
	MenuItems
} from '@headlessui/vue';
const user = {
	name: 'Tom Cook',
	email: 'tom@example.com',
	imageUrl:
		'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
};
const navigation = [
	{ name: 'Dashboard', href: '#', current: true },
	{ name: 'Team', href: '#', current: false },
	{ name: 'Projects', href: '#', current: false },
	{ name: 'Calendar', href: '#', current: false },
	{ name: 'Reports', href: '#', current: false }
];
const userNavigation = [
	{ name: 'Your Profile', href: '#' },
	{ name: 'Settings', href: '#' },
	{ name: 'Sign out', href: '#' }
];
</script>

<template>
	<div class="block">
		<div class="ml-4 flex items-center md:ml-6">
			<button
				type="button"
				class="
					p-1
					rounded-full
					text-gray-400
					hover:text-white
					focus:outline-none
					focus:ring-2
					focus:ring-offset-2
					focus:ring-offset-gray-800
					focus:ring-white
				"
			>
				<span class="sr-only">View notifications</span>
				<BellIcon class="h-6 w-6" aria-hidden="true" />
			</button>

			<!-- Profile dropdown -->
			<Menu as="div" class="ml-3 relative">
				<div>
					<MenuButton
						class="
							max-w-xs
							rounded-full
							flex
							items-center
							text-sm
							focus:outline-none
							focus:ring-2
							focus:ring-offset-2
							focus:ring-offset-gray-800
							focus:ring-white
						"
					>
						<span class="sr-only">Open user menu</span>
						<img class="h-8 w-8 rounded-full" :src="user.imageUrl" alt="" />
					</MenuButton>
				</div>
				<transition
					enter-active-class="transition ease-out duration-100"
					enter-from-class="transform opacity-0 scale-95"
					enter-to-class="transform opacity-100 scale-100"
					leave-active-class="transition ease-in duration-75"
					leave-from-class="transform opacity-100 scale-100"
					leave-to-class="transform opacity-0 scale-95"
				>
					<MenuItems
						class="
							origin-top-right
							absolute
							right-0
							mt-2
							w-48
							rounded-md
							shadow-lg
							py-1
							bg-white
							ring-1 ring-black ring-opacity-5
							focus:outline-none
						"
					>
						<MenuItem
							v-for="item in userNavigation"
							:key="item.name"
							v-slot="{ active }"
						>
							<a
								:href="item.href"
								:class="[
									active ? 'bg-gray-100' : '',
									'block px-4 py-2 text-sm text-gray-700'
								]"
								>{{ item.name }}</a
							>
						</MenuItem>
					</MenuItems>
				</transition>
			</Menu>
		</div>
	</div>
</template>
