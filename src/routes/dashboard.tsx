import { redirect, LoaderArgs, json, ActionArgs } from '@remix-run/node';
import { Session } from '~/sessions';

import { FirebaseServer } from '~/firebase/server/firebase.server';
import { ListSchema } from '~/schema/Schema';
import { Form, useLoaderData } from '@remix-run/react';

export const loader = async ({ request }: LoaderArgs) => {
	const user = await Session.isUserSessionValid(request);

	if (!user) {
		return redirect('/');
	}

	const snapshot = await FirebaseServer.database.collection('lists').get();

	const documents = snapshot.docs.map(doc =>
		ListSchema.parse({ id: doc.id, ...doc.data() })
	);

	return json({ lists: documents });
};

export const action = async ({ request }: ActionArgs) => {
	const user = await Session.isUserSessionValid(request);

	if (!user) {
		return redirect('/');
	}

	const formData = await request.formData();

	const name = formData.get('name');

	const currentTimestamp = new Date().toISOString();

	const newList = ListSchema.parse({
		name,
		author_id: user.uid,
		deleted: false,
		participants: {
			[user.uid]: { name: user.name, email: user.email, image: user.picture }
		},
		created_at: currentTimestamp,
		updated_at: currentTimestamp
	});

	await FirebaseServer.database.collection('lists').add(newList);

	return null;
};

export default function Dashboard() {
	const loaderData = useLoaderData<typeof loader>();

	const lists = loaderData.lists.map((list, index) => (
		<li key={index}>{list.name}</li>
	));

	return (
		<>
			<div>Lists</div>
			<ul>{lists}</ul>
			<hr />
			<Form method="post">
				<input name="name" type="text" placeholder="Name" />
				<button type="submit">Create</button>
			</Form>
		</>
	);
}
