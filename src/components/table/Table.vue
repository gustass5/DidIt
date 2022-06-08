<script setup lang="ts">
import TableHeader from './TableHeader.vue';
import TableRow from './TableRow.vue';

const props = defineProps<{
	user: any | null;
	listId: string;
	rows: any[];
	participants: any[];
}>();
</script>

<template>
	<table
		class="min-w-full divide-y divide-gray-200 border-2 border-gray-100 rounded-md"
	>
		<TableHeader />
		<tbody class="bg-white divide-y divide-gray-200">
			<TableRow
				v-for="row in props.rows"
				v-bind:listId="props.listId"
				v-bind:id="row.id"
				v-bind:data="row.data"
				v-bind:user="user"
				v-bind:participants="props.participants"
			/>
		</tbody>
	</table>
</template>
