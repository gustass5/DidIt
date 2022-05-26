<script setup lang="ts">
defineProps<{ name: string }>();
</script>

<template>
	<li
		className="p-3 m-2 rounded-r-sm text-white cursor-pointer hover:bg-gray-700 border-l-2 border-gray-800 hover:border-orange-500"
	>
		{{ name }}
	</li>
</template>
