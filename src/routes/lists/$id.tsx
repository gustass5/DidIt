import { json, LoaderArgs, redirect, ActionArgs } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import { FirebaseServer } from '~/firebase/server/firebase.server';
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

	if (!(user.uid in listData.participants)) {
		throw new Error('List is not accessible');
	}

	const tasksSnapshot = await listsReference.doc(listId).collection('tasks').get();

	const tasksDocuments = tasksSnapshot.docs.map(doc =>
		TaskSchema.parse({ id: doc.id, ...doc.data() })
	);

	return json({ tasks: tasksDocuments });
};

export const action = async ({ request, params }: ActionArgs) => {
	const user = await Session.isUserSessionValid(request);

	if (!user) {
		return redirect('/');
	}

	const formData = await request.formData();

	const name = formData.get('name');

	const labels = formData.get('labels');

	const currentTimestamp = new Date().toISOString();

	const newTask = TaskSchema.parse({
		name,
		author_id: user.uid,
		responsible: {
			[user.uid]: { name: user.name, email: user.email, image: user.picture }
		},
		completed: {},
		labels,
		created_at: currentTimestamp,
		updated_at: currentTimestamp
	});

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

	if (!(user.uid in listData.participants)) {
		throw new Error('List is not accessible');
	}

	await listSnapshot.ref.collection('tasks').add(newTask);

	return null;
};

export default function ListPage() {
	const loaderData = useLoaderData<typeof loader>();

	const tasks = loaderData.tasks.map((task, index) => (
		<li key={index}>{task.name}</li>
	));

	return (
		<div>
			<h1>Single list</h1>
			{tasks.length !== 0 ? <ul>{tasks}</ul> : <span>No tasks yet</span>}
			<hr />

			<Form method="post">
				<input name="name" type="text" placeholder="Name" />
				<input name="labels" type="text" placeholder="Label(s)" />
				<button type="submit">Create</button>
			</Form>
		</div>
	);
}
