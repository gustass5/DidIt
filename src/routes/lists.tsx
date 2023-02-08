import { Dialog } from '@headlessui/react';

import { redirect, LoaderArgs, json, ActionArgs } from '@remix-run/node';
import { Session } from '~/sessions';

import { FirebaseServer } from '~/firebase/server/firebase.server';
import { InvitationSchema, ListSchema, UserSchema } from '~/schema/Schema';
import { Form, Link, Outlet, useFetcher, useLoaderData } from '@remix-run/react';

import { useState } from 'react';
import { z } from 'zod';
import { createList } from '~/handlers/list/createList';
import { updateList } from '~/handlers/list/updateList';
import { inviteUsers } from '~/handlers/list/inviteUsers';

export const loader = async ({ request }: LoaderArgs) => {
	const user = await Session.isUserSessionValid(request);

	if (!user) {
		return redirect('/');
	}

	const listsSnapshot = await FirebaseServer.database
		.collection('lists')
		.where(`participants.${user.id}`, '!=', null)
		.get();

	const listsDocuments = listsSnapshot.docs.map(doc =>
		ListSchema.parse({ id: doc.id, ...doc.data() })
	);

	return json({ lists: listsDocuments });
};

const ListActionSchema = z.union(
	[z.literal('create'), z.literal('update'), z.literal('invite')],
	{
		invalid_type_error: 'Invalid action type'
	}
);

export const action = async ({ request }: ActionArgs) => {
	const user = await Session.isUserSessionValid(request);

	if (!user) {
		return redirect('/');
	}

	const formData = await request.formData();

	// Get action type
	const action = ListActionSchema.parse(formData.get('action'));
	if (action === 'create') {
		await createList(formData, user);

		return null;
	}

	if (action === 'update') {
		await updateList(formData, user);

		return null;
	}

	if (action === 'invite') {
		await inviteUsers(formData, user);

		return null;
	}

	return null;
};

export default function Dashboard() {
	const loaderData = useLoaderData<typeof loader>();

	const updateFetcher = useFetcher();

	const [isOpen, setIsOpen] = useState(false);

	const [listToUpdate, setListToUpdate] = useState<z.infer<typeof ListSchema> | null>(
		null
	);

	const lists = loaderData.lists.map((list, index) => (
		<li key={index}>
			<Link to={`${list.id}`}>{list.name}</Link>
			<button
				onClick={() => {
					setListToUpdate(list);
					setIsOpen(true);
				}}
			>
				UPDATE
			</button>
		</li>
	));

	return (
		<>
			<h1>
				<Link to="lists">Lists</Link>
			</h1>

			<ul>{lists}</ul>
			<hr />
			<Form method="post">
				<input name="name" type="text" placeholder="Name" />
				<button name="action" type="submit" value="create">
					Create
				</button>
			</Form>

			<Dialog
				open={isOpen}
				onClose={() => setIsOpen(false)}
				className="relative z-50"
			>
				<div className="fixed inset-0 bg-black/30" aria-hidden="true" />
				<div className="fixed inset-0 flex items-center justify-center p-4">
					<Dialog.Panel className="w-full max-w-sm rounded bg-white">
						<Dialog.Title>Update list name</Dialog.Title>
						<Dialog.Description>
							This will update list name
						</Dialog.Description>

						<updateFetcher.Form method="post">
							<input
								name="listId"
								type="hidden"
								value={listToUpdate?.id}
							/>
							<input
								name="name"
								type="text"
								placeholder="Name"
								defaultValue={listToUpdate?.name}
							/>
							<button name="action" type="submit" value="update">
								Update
							</button>
						</updateFetcher.Form>
					</Dialog.Panel>
				</div>
			</Dialog>
			<Outlet />
		</>
	);
}
