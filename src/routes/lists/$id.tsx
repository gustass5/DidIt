import { Dialog } from '@headlessui/react';
import { json, LoaderArgs, redirect, ActionArgs } from '@remix-run/node';
import { Form, useFetcher, useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import { z } from 'zod';
import { getList } from '~/controllers/list/getList';
import { createTask } from '~/controllers/task/createTask';
import { deleteTask } from '~/controllers/task/deleteTask';
import { toggleComplete } from '~/controllers/task/toggleComplete';
import { toggleResponsible } from '~/controllers/task/toggleResponsible';
import { updateTask } from '~/controllers/task/updateTask';
import { TaskSchema } from '~/schema/Schema';
import { Session } from '~/sessions';
import { ParticipantsWidget } from '~/widgets/ParticipantsWidget';
import { UserInvitationWidget } from '~/widgets/UserInvitationWidet';

export const loader = async ({ request, params }: LoaderArgs) => {
	const user = await Session.isUserSessionValid(request);

	if (!user) {
		return redirect('/');
	}

	const formData = new FormData();

	formData.append('listId', params.id || '');

	const { listData, listSnapshot } = await getList(formData, user);

	const tasksSnapshot = await listSnapshot.ref.collection('tasks').get();

	const tasksDocuments = tasksSnapshot.docs.map(doc =>
		TaskSchema.parse({ id: doc.id, ...doc.data() })
	);

	return json({ listData, tasks: tasksDocuments, user });
};

const TaskActionSchema = z.union(
	[
		z.literal('create'),
		z.literal('update'),
		z.literal('responsible'),
		z.literal('complete'),
		z.literal('delete')
	],
	{ invalid_type_error: 'Invalid action type' }
);

export const action = async ({ request, params }: ActionArgs) => {
	const user = await Session.isUserSessionValid(request);

	if (!user) {
		return redirect('/');
	}

	const formData = await request.formData();

	formData.append('listId', params.id || '');

	const action = TaskActionSchema.parse(formData.get('action'));

	if (action === 'create') {
		await createTask(formData, user);

		return null;
	}

	if (action === 'update') {
		await updateTask(formData, user);

		return null;
	}

	if (action === 'delete') {
		await deleteTask(formData, user);

		return null;
	}

	if (action === 'responsible') {
		await toggleResponsible(formData, user);

		return null;
	}

	if (action === 'complete') {
		await toggleComplete(formData, user);

		return null;
	}

	return null;
};

export default function ListPage() {
	const loaderData = useLoaderData<typeof loader>();

	const responsibleFetcher = useFetcher();
	const completeFetcher = useFetcher();
	const updateFetcher = useFetcher();
	const deleteFetcher = useFetcher();

	const [isOpen, setIsOpen] = useState(false);

	const [taskToUpdate, setTaskToUpdate] = useState<z.infer<typeof TaskSchema> | null>(
		null
	);

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
			{(loaderData.listData.author_id === loaderData.user.id ||
				task.author_id === loaderData.user.id) && (
				<deleteFetcher.Form method="post">
					<input name="taskId" type="hidden" value={task.id} />
					<button name="action" type="submit" value="delete">
						delete
					</button>
				</deleteFetcher.Form>
			)}

			<button
				onClick={() => {
					setTaskToUpdate(task);
					setIsOpen(true);
				}}
			>
				UPDATE
			</button>
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

			<Dialog
				open={isOpen}
				onClose={() => setIsOpen(false)}
				className="relative z-50"
			>
				<div className="fixed inset-0 bg-black/30" aria-hidden="true" />
				<div className="fixed inset-0 flex items-center justify-center p-4">
					<Dialog.Panel className="w-full max-w-sm rounded bg-white">
						<Dialog.Title>Update task</Dialog.Title>
						<Dialog.Description>This will update task</Dialog.Description>

						<updateFetcher.Form method="post">
							<input
								name="taskId"
								type="hidden"
								value={taskToUpdate?.id}
							/>
							<input
								name="name"
								type="text"
								placeholder="Name"
								defaultValue={taskToUpdate?.name}
							/>
							<input
								name="labels"
								type="text"
								placeholder="Label(s)"
								defaultValue={taskToUpdate?.labels}
							/>
							<button name="action" type="submit" value="update">
								Update
							</button>
						</updateFetcher.Form>
					</Dialog.Panel>
				</div>
			</Dialog>
			<UserInvitationWidget listData={loaderData.listData} />
			<Form method="post" action="/lists">
				<button name="action" value="leave">
					<input name="listId" type="hidden" value={loaderData.listData.id} />
					Leave list
				</button>
			</Form>
			{loaderData.listData.author_id === loaderData.user.id && (
				<Form method="post" action="/lists">
					<button name="action" value="delete">
						<input
							name="listId"
							type="hidden"
							value={loaderData.listData.id}
						/>
						Delete list
					</button>
				</Form>
			)}

			<ParticipantsWidget listData={loaderData.listData} user={loaderData.user} />
		</div>
	);
}
