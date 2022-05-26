<script setup lang="ts">
import TableHeader from './TableHeader.vue';
import TableRow from './TableRow.vue';
</script>

<template>
	<table class="min-w-full divide-y divide-gray-200">
		<TableHeader />
		<tbody class="bg-white divide-y divide-gray-200">
			<TableRow />
		</tbody>
	</table>
</template>
