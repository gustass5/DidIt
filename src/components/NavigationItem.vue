<script setup lang="ts">
const props = defineProps<{ name: string; active: boolean }>();
</script>

<template>
	<li
		v-bind:class="{
			'p-3 my-2 rounded-r-sm text-white cursor-pointer hover:bg-gray-700 border-l-2 border-gray-800 hover:border-orange-500 font-medium': true,
			'bg-gray-700 border-orange-500': props.active
		}"
	>
		{{ name }}
	</li>
</template>
