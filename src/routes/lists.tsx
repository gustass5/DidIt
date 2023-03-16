import { redirect, LoaderArgs, json, ActionArgs } from '@remix-run/node';
import { Session } from '~/sessions';

import { FirebaseServer } from '~/firebase/server/firebase.server';
import { ListSchema } from '~/schema/Schema';
import { Form, Outlet, useLoaderData } from '@remix-run/react';
import {} from '@headlessui/react';
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
import { UserMenu } from '~/components/UserMenu/UserMenu';
import { Logo } from '~/components/Logo/Logo';

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
		<div className="h-full flex flex-col">
			<div className="flex">
				<div className="flex items-center w-[300px] p-2 bg-gray-900 h-24 text-orange-400">
					<Logo />
					<span className="px-4 text-2xl font-semibold">DIDIT</span>
				</div>
				<div className="flex flex-1 bg-gray-900 items-center justify-end px-6">
					<NotificationWidget user={loaderData.user} />

					<UserMenu user={loaderData.user} />
				</div>
			</div>

			<div className="flex flex-1">
				<div className="flex flex-col w-[300px] bg-gray-900">
					<Form method="post">
						<input name="name" type="text" placeholder="Name" />
						<button name="action" type="submit" value="create">
							Create
						</button>
					</Form>

					<ul className="flex flex-col p-2 space-y-2">{lists}</ul>
				</div>

				<div className="flex-1">
					<Outlet />
				</div>
			</div>
		</div>
	);
}
