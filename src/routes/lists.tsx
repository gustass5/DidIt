import { Dialog } from '@headlessui/react';

import { redirect, LoaderArgs, json, ActionArgs } from '@remix-run/node';
import { Session } from '~/sessions';

import { FirebaseServer } from '~/firebase/server/firebase.server';
import { ListSchema, ListType } from '~/schema/Schema';
import { Form, Link, Outlet, useFetcher, useLoaderData } from '@remix-run/react';

import { useState } from 'react';
import { z } from 'zod';
import { createList } from '~/controllers/list/createList';
import { updateList } from '~/controllers/list/updateList';
import { inviteUsers } from '~/controllers/list/inviteUsers';
import { NotificationWidget } from '~/widgets/NotificationWidget';
import { leaveList } from '~/controllers/list/leaveList';
import { deleteList } from '~/controllers/list/deleteList';
import { kickUser } from '~/controllers/list/kickUser';
import { ListItem } from '~/components/ListItem/ListItem';
import { UpdateListWidget } from '~/widgets/UpdateListWidget';

export const loader = async ({ request }: LoaderArgs) => {
	const user = await Session.isUserSessionValid(request);

	if (!user) {
		return redirect('/');
	}

	const listsSnapshot = await FirebaseServer.database
		.collection('lists')
		.where('deleted', '==', false)
		.where(`participants.${user.id}.id`, '==', user.id)
		.get();

	const listsDocuments = listsSnapshot.docs.map(doc =>
		ListSchema.parse({ id: doc.id, ...doc.data() })
	);

	return json({ lists: listsDocuments, user });
};

const ListActionSchema = z.union(
	[
		z.literal('create'),
		z.literal('update'),
		z.literal('leave'),
		z.literal('delete'),
		z.literal('invite'),
		z.literal('kick')
	],
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

	const action = ListActionSchema.parse(formData.get('action'));

	if (action === 'create') {
		await createList(formData, user);

		return null;
	}

	if (action === 'update') {
		await updateList(formData, user);

		return null;
	}

	if (action === 'leave') {
		await leaveList(formData, user);

		return null;
	}

	if (action === 'delete') {
		await deleteList(formData, user);

		return null;
	}

	if (action === 'invite') {
		await inviteUsers(formData, user);

		return null;
	}

	if (action == 'kick') {
		await kickUser(formData, user);

		return null;
	}

	return null;
};

export default function Dashboard() {
	const loaderData = useLoaderData<typeof loader>();

	const lists = loaderData.lists.map((list, index) => (
		<ListItem key={index} list={list}>
			<UpdateListWidget list={list} />
		</ListItem>
	));

	return (
		<div className="flex">
			<div className="flex flex-col w-[300px] h-screen bg-[#0d0f15]">
				<div>{/* Place for logo */}</div>
				<h1>
					<Link to="lists">Lists</Link>
				</h1>

				<NotificationWidget user={loaderData.user} />

				<Form method="post">
					<input name="name" type="text" placeholder="Name" />
					<button name="action" type="submit" value="create">
						Create
					</button>
				</Form>

				<ul className="flex flex-1 flex-col p-2 space-y-2">{lists}</ul>
			</div>
			<div className="flex flex-1">
				<Outlet />
			</div>
		</div>
	);
}
