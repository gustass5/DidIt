import { json, LoaderArgs, redirect, ActionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import { z } from 'zod';
import { Card } from '~/components/Card/Card';
import { getList } from '~/controllers/list/getList';
import { createTask } from '~/controllers/task/createTask';
import { deleteTask } from '~/controllers/task/deleteTask';
import { toggleComplete } from '~/controllers/task/toggleComplete';
import { toggleResponsible } from '~/controllers/task/toggleResponsible';
import { updateTask } from '~/controllers/task/updateTask';
import { TaskSchema, TaskType } from '~/schema/Schema';
import { Session } from '~/sessions';
import { ParticipantsWidget } from '~/widgets/ParticipantsWidget';
import { UserInvitationWidget } from '~/widgets/UserInvitationWidet';
import {
	UsersIcon,
	StopCircleIcon,
	CheckCircleIcon
} from '@heroicons/react/24/outline';
import { InfoCard } from '~/components/InfoCard/InfoCard';
import { UpdateTaskWidget } from '~/widgets/UpdateTaskWidget';
import { DeleteListWidget } from '~/widgets/DeleteListWidget';
import { LeaveListWidget } from '~/widgets/LeaveListWidget';
import { CreateTaskWidget } from '~/widgets/CreateTaskWidget';
import { SetResponsibleWidget } from '~/widgets/SetResponsibleWidget';
import { SetCompleteWidget } from '~/widgets/SetCompleteWidget';
import { DeleteTaskWidget } from '~/widgets/DeleteTaskWidget';

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

	const [actionable, setActionable] = useState(false);

	const isUserListOwner = loaderData.listData.author_id === loaderData.user.id;

	const tasks = loaderData.tasks.map((task, index) => {
		const isUserTaskCreator = task.author_id === loaderData.user.id;

		const isUserTaskParticipant =
			task.responsible[loaderData.user.id] !== undefined;

		return (
			<li
				key={index}
				className="flex justify-between p-4 rounded text-[#9ba6b2] bg-[#191d2a]"
			>
				<span>{task.name}</span>

				<SetResponsibleWidget task={task} user={loaderData.user} />

				{isUserTaskParticipant && (
					<SetCompleteWidget task={task} user={loaderData.user} />
				)}

				{(isUserListOwner || isUserTaskCreator) && actionable && (
					<DeleteTaskWidget task={task} />
				)}

				{actionable && <UpdateTaskWidget task={task} />}
			</li>
		);
	});
	return (
		<div className="flex flex-col p-6">
			<div className="flex space-x-6">
				<InfoCard list={loaderData.listData} />
				<div className="flex flex-1 justify-between">
					<Card
						title="Total tasks"
						data={12}
						backgroundColorClass="bg-teal-400"
						textColorClass="text-teal-400"
						icon={StopCircleIcon}
					/>
					<Card
						title="Completed"
						data={4}
						backgroundColorClass="bg-green-400"
						textColorClass="text-green-400"
						icon={CheckCircleIcon}
					/>
					<Card
						title="Participants"
						data={5}
						backgroundColorClass="bg-indigo-400"
						textColorClass="text-indigo-400"
						icon={UsersIcon}
					/>
				</div>
			</div>

			{tasks.length !== 0 ? (
				<ul className="flex flex-col space-y-2 py-6">{tasks}</ul>
			) : (
				<span>No tasks yet</span>
			)}

			<hr />

			<CreateTaskWidget />

			<UserInvitationWidget listData={loaderData.listData} />

			<LeaveListWidget listId={loaderData.listData.id} />

			{isUserListOwner && <DeleteListWidget listId={loaderData.listData.id} />}

			<ParticipantsWidget listData={loaderData.listData} user={loaderData.user} />
		</div>
	);
}
