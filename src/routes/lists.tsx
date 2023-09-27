import { redirect, LoaderArgs, json, ActionArgs } from '@remix-run/node';
import { Session } from '~/sessions';

import { FirebaseServer } from '~/firebase/server/firebase.server';
import { ListSchema } from '~/schema/Schema';
import { Form, Outlet, useLoaderData } from '@remix-run/react';
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
import { Button } from '~/components/Button/Button';

export const loader = async ({ request, params }: LoaderArgs) => {
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

	return json({ lists: listsDocuments, listId: params.id, user });
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
		<div className="h-full flex flex-col w-full">
			<div className="flex justify-between">
				<a href="/lists">
					<div className="flex items-center xl:w-[300px] px-2 py-6 xl:p-2 bg-gray-950 xl:bg-gray-900 h-24 text-orange-400">
						<Logo />
						<span className="px-4 text-2xl font-semibold">DIDIT</span>
					</div>
				</a>
				<div className="flex flex-1 bg-gray-950 items-center justify-end px-2 xl:px-6">
					<div className="flex items-center justify-center">
						<NotificationWidget user={loaderData.user} />

						<UserMenu user={loaderData.user} />
					</div>
				</div>
			</div>

			<div className="flex flex-1">
				<div
					className={`flex-col ${
						loaderData.listId ? 'w-[300px] hidden' : 'w-full flex'
					} p-4 text-gray-400 bg-gray-900 xl:flex`}
				>
					<div className="font-semibold text-sm pt-8 pb-2 uppercase">
						Create new list
					</div>

					<Form method="post">
						<input
							name="name"
							type="text"
							placeholder="List name"
							className="bg-transparent outline-none py-4"
						/>

						<Button
							name="action"
							value="create"
							className="w-full text-orange-400 border-orange-400"
						>
							CREATE
						</Button>
					</Form>

					<div className="font-semibold text-sm pt-6 pb-4 uppercase">
						Lists
					</div>

					<ul className="flex flex-col">{lists}</ul>
				</div>

				{loaderData.listId && (
					<div className="flex-1">
						<Outlet />
					</div>
				)}
			</div>
		</div>
	);
}
