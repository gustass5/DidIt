import { json, LoaderArgs, redirect, ActionArgs } from '@remix-run/node';
import { Form, useFetcher, useLoaderData } from '@remix-run/react';
import { z } from 'zod';
import { FirebaseServer } from '~/firebase/server/firebase.server';
import { createTask } from '~/handlers/task/createTask';
import { toggleComplete } from '~/handlers/task/toggleComplete';
import { toggleResponsible } from '~/handlers/task/toggleResponsible';
import { ListSchema, TaskSchema } from '~/schema/Schema';
import { Session } from '~/sessions';

export const loader = async ({ request, params }: LoaderArgs) => {
	const user = await Session.isUserSessionValid(request);

	if (!user) {
		return redirect('/');
	}

	const listId = params.id;

	if (typeof listId !== 'string') {
		throw new Error('List id is invalid');
	}

	const listsReference = await FirebaseServer.database.collection('lists');

	const listSnapshot = await listsReference.doc(listId).get();

	if (!listSnapshot.exists) {
		throw new Error('List does not exist');
	}

	const listData = ListSchema.parse(await listSnapshot.data());

	if (!(user.id in listData.participants)) {
		throw new Error('List is not accessible');
	}

	const tasksSnapshot = await listsReference.doc(listId).collection('tasks').get();

	const tasksDocuments = tasksSnapshot.docs.map(doc =>
		TaskSchema.parse({ id: doc.id, ...doc.data() })
	);

	return json({ tasks: tasksDocuments, user });
};

const TaskActionSchema = z.union(
	[z.literal('create'), z.literal('responsible'), z.literal('complete')],
	{ invalid_type_error: 'Invalid action type' }
);

export const action = async ({ request, params }: ActionArgs) => {
	const user = await Session.isUserSessionValid(request);

	if (!user) {
		return redirect('/');
	}

	const formData = await request.formData();

	// Get action type
	const action = TaskActionSchema.parse(formData.get('action'));

	const listId = params.id;

	if (typeof listId !== 'string') {
		throw new Error('List id is invalid');
	}

	// Get and check if list that task belongs to is available to the user
	const listsReference = await FirebaseServer.database.collection('lists');

	const listSnapshot = await listsReference.doc(listId).get();

	if (!listSnapshot.exists) {
		throw new Error('List does not exist');
	}

	const listData = ListSchema.parse(await listSnapshot.data());

	if (!(user.id in listData.participants)) {
		throw new Error('List is not accessible');
	}

	if (action === 'create') {
		await createTask(listSnapshot, formData, user);

		return null;
	}

	// If action was not to create a new task, check if task id was provided
	const taskId = formData.get('taskId');

	if (taskId === null) {
		throw new Error('No task id provided');
	}

	if (typeof taskId !== 'string') {
		throw new Error('Task id is invalid');
	}

	// Get task snapshot so changes can be made to it
	const taskSnapshot = await listSnapshot.ref.collection('tasks').doc(taskId).get();

	if (!taskSnapshot.exists) {
		throw new Error('Task does not exist');
	}

	if (action === 'responsible') {
		await toggleResponsible(taskSnapshot, user);

		return null;
	}

	if (action === 'complete') {
		await toggleComplete(taskSnapshot, user);
	}

	return null;
};

export default function ListPage() {
	const loaderData = useLoaderData<typeof loader>();

	const responsibleFetcher = useFetcher();
	const completeFetcher = useFetcher();

	const tasks = loaderData.tasks.map((task, index) => (
		<li key={index} className="flex space-between">
			<span>{task.name}</span>
			<responsibleFetcher.Form method="post">
				<input name="taskId" type="hidden" value={task.id} />
				<button name="action" type="submit" value="responsible">
					{task.responsible[loaderData.user.id] ? 'JOINED' : 'JOIN'}
				</button>
			</responsibleFetcher.Form>
			<completeFetcher.Form method="post">
				<input name="taskId" type="hidden" value={task.id} />
				<button
					name="action"
					type="submit"
					value="complete"
					disabled={!task.responsible[loaderData.user.id]}
				>
					{task.completed[loaderData.user.id] ? 'COMPLETED' : 'COMPLETE'}
				</button>
			</completeFetcher.Form>
		</li>
	));

	return (
		<div>
			<h1>Single list</h1>
			{tasks.length !== 0 ? <ul>{tasks}</ul> : <span>No tasks yet</span>}
			<hr />

			<Form method="post">
				<input name="name" type="text" placeholder="Name" />
				<input name="labels" type="text" placeholder="Label(s)" />
				<button name="action" type="submit" value="create">
					Create
				</button>
			</Form>
		</div>
	);
}
