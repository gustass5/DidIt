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
import { TaskSchema } from '~/schema/Schema';
import { Session } from '~/sessions';
import { ParticipantsWidget } from '~/widgets/ParticipantsWidget';
import { UserInvitationWidget } from '~/widgets/UserInvitationWidet';
import {
	UsersIcon,
	StopCircleIcon,
	CheckCircleIcon,
	CircleStackIcon
} from '@heroicons/react/24/outline';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import { InfoCard } from '~/components/InfoCard/InfoCard';
import { UpdateTaskWidget } from '~/widgets/UpdateTaskWidget';
import { DeleteListWidget } from '~/widgets/DeleteListWidget';
import { LeaveListWidget } from '~/widgets/LeaveListWidget';
import { CreateTaskWidget } from '~/widgets/CreateTaskWidget';
import { SetResponsibleWidget } from '~/widgets/SetResponsibleWidget';
import { SetCompleteWidget } from '~/widgets/SetCompleteWidget';
import { DeleteTaskWidget } from '~/widgets/DeleteTaskWidget';
import { ResponsibleImage } from '~/components/ResponsibleImage/ResponsibleImage';
import { Button } from '~/components/Button/Button';
import { MoreActionsWidget } from '~/widgets/MoreActionsWidget';

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
	const { listData, tasks: listTasks, user } = useLoaderData<typeof loader>();

	const isUserListOwner = listData.author_id === user.id;

	const tasks = listTasks.map((task, index) => {
		const isUserTaskCreator = task.author_id === user.id;

		const isUserTaskParticipant = task.responsible[user.id] !== undefined;

		const taskResponsible = Object.values(task.responsible);

		return (
			<li
				key={index}
				className="flex justify-between items-center p-4 rounded text-[#9ba6b2] bg-[#191d2a]"
			>
				<div className="flex -space-x-2 w-20 items-center">
					<ResponsibleImage image={taskResponsible[0]?.image} />

					<ResponsibleImage image={taskResponsible[1]?.image} />

					{taskResponsible.length >= 3 && (
						<PlusCircleIcon className="h-9 w-9 text-gray-700" />
					)}
				</div>

				<span className="flex flex-1">{task.name}</span>

				<div className="flex space-x-2 pl-6">
					{isUserTaskParticipant && (
						<SetCompleteWidget task={task} user={user} />
					)}

					<MoreActionsWidget>
						<div className="flex flex-col space-y-4">
							<SetResponsibleWidget task={task} user={user} />

							<UpdateTaskWidget task={task} />

							{(isUserListOwner || isUserTaskCreator) && (
								<DeleteTaskWidget task={task} />
							)}
						</div>
					</MoreActionsWidget>
				</div>
			</li>
		);
	});
	return (
		<div className="flex flex-col p-6">
			<div className="flex space-x-6">
				<InfoCard list={listData} />
				<div className="flex flex-1 justify-between space-x-6">
					<Card
						title="Total tasks"
						data={listTasks.length}
						backgroundColorClass="bg-blue-400"
						textColorClass="text-blue-400"
						icon={CircleStackIcon}
					/>
					<Card
						title="Tasks covered"
						data={
							listTasks.filter(
								task => Object.values(task.responsible).length > 0
							).length
						}
						backgroundColorClass="bg-teal-400"
						textColorClass="text-teal-400"
						icon={StopCircleIcon}
					/>
					<Card
						title="Tasks completed"
						data={
							listTasks.filter(
								task => Object.values(task.completed).length > 0
							).length
						}
						backgroundColorClass="bg-green-400"
						textColorClass="text-green-400"
						icon={CheckCircleIcon}
					/>
					<Card
						title="Participants"
						data={Object.values(listData.participants).length}
						backgroundColorClass="bg-indigo-400"
						textColorClass="text-indigo-400"
						icon={UsersIcon}
					/>
				</div>
			</div>

			<CreateTaskWidget>
				<MoreActionsWidget>
					<ParticipantsWidget listData={listData} user={user} />

					<UserInvitationWidget listData={listData} />

					{<LeaveListWidget listId={listData.id} />}

					{isUserListOwner && <DeleteListWidget listId={listData.id} />}
				</MoreActionsWidget>
			</CreateTaskWidget>

			{tasks.length !== 0 ? (
				<ul className="flex flex-col space-y-2 py-2">{tasks}</ul>
			) : (
				<span>No tasks yet</span>
			)}
		</div>
	);
}
