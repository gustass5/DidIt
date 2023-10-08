import { json, LoaderArgs, redirect, ActionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { ZodError, z } from 'zod';
import { Card } from '~/components/Card/Card';
import { getList } from '~/controllers/list/getList';
import { createTask } from '~/controllers/task/createTask';
import { deleteTask } from '~/controllers/task/deleteTask';
import { toggleComplete } from '~/controllers/task/toggleComplete';
import { toggleResponsible } from '~/controllers/task/toggleResponsible';
import { updateTask } from '~/controllers/task/updateTask';
import { TaskSchema } from '~/schema/Schema';
import { Session } from '~/sessions';
import { SeeParticipantsWidget } from '~/widgets/SeeParticipantsWidget';
import { UserInvitationWidget } from '~/widgets/UserInvitationWidet';
import {
	UsersIcon,
	StopCircleIcon,
	CheckCircleIcon,
	CircleStackIcon
} from '@heroicons/react/24/outline';
import { InfoCard } from '~/components/InfoCard/InfoCard';
import { DeleteListWidget } from '~/widgets/DeleteListWidget';
import { LeaveListWidget } from '~/widgets/LeaveListWidget';
import { CreateTaskWidget } from '~/widgets/CreateTaskWidget';
import { MoreActionsWidget } from '~/widgets/MoreActionsWidget';
import { ActionError } from '~/errors/ActionError';
import { useAlerts } from '~/components/Alert/useAlerts';
import { TaskRow } from '~/components/TaskRow/TaskRow';
import { inviteUsers } from '~/controllers/list/inviteUsers';
import { kickUser } from '~/controllers/list/kickUser';

export const loader = async ({ request, params }: LoaderArgs) => {
	try {
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
	} catch (error: unknown) {
		throw new Error('Unexpected error happened');
	}
};

const TaskActionSchema = z.union(
	[
		z.literal('create'),
		z.literal('update'),
		z.literal('responsible'),
		z.literal('complete'),
		z.literal('delete'),
		z.literal('invite'),
		z.literal('kick')
	],
	{ invalid_type_error: 'Invalid action type' }
);

export const action = async ({ request, params }: ActionArgs) => {
	try {
		const user = await Session.isUserSessionValid(request);

		if (!user) {
			return redirect('/');
		}

		const formData = await request.formData();

		formData.append('listId', params.id || '');

		const action = TaskActionSchema.parse(formData.get('action'));

		if (action === 'create') {
			return await createTask(formData, user);
		}

		if (action === 'update') {
			return await updateTask(formData, user);
		}

		if (action === 'delete') {
			return await deleteTask(formData, user);
		}

		if (action === 'responsible') {
			return await toggleResponsible(formData, user);
		}

		if (action === 'complete') {
			return await toggleComplete(formData, user);
		}

		if (action === 'invite') {
			return await inviteUsers(formData, user);
		}

		if (action == 'kick') {
			return await kickUser(formData, user);
		}

		return json({
			notification: { type: 'error', title: 'Error', text: 'Unexpected error' }
		});
	} catch (error: unknown) {
		if (error instanceof ZodError) {
			return json({
				notification: {
					type: 'error',
					title: 'Error',
					text: 'Invalid input'
				}
			});
		}

		if (error instanceof ActionError) {
			return json({
				notification: { type: 'error', title: 'Error', text: error.message }
			});
		}

		return json({
			notification: {
				type: 'error',
				title: 'Error',
				text: 'Unexpected error ocurred'
			}
		});
	}
};

export default function ListPage() {
	const { listData, tasks: listTasks, user } = useLoaderData<typeof loader>();

	useAlerts();

	const isUserListOwner = listData.author_id === user.id;

	const tasks = listTasks.map(task => (
		<TaskRow
			key={task.id}
			task={task}
			user={user}
			isUserListOwner={isUserListOwner}
		/>
	));

	return (
		<div className="flex flex-col p-2 xl:p-6">
			<div className="flex flex-col xl:flex-row space-y-4 xl:space-y-0 xl:space-x-4">
				<InfoCard list={listData} />
				<div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
					<Card
						title="Total tasks"
						data={listTasks.length}
						backgroundColorClass="bg-blue-400"
						textColorClass="text-blue-400"
						borderColorClass="border-blue-400"
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
						borderColorClass="border-teal-400"
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
						borderColorClass="border-green-400"
						icon={CheckCircleIcon}
					/>
					<Card
						title="Participants"
						data={Object.values(listData.participants).length}
						backgroundColorClass="bg-indigo-400"
						textColorClass="text-indigo-400"
						borderColorClass="border-indigo-400"
						icon={UsersIcon}
					/>
				</div>
			</div>

			<CreateTaskWidget>
				<MoreActionsWidget title="List actions">
					<SeeParticipantsWidget listData={listData} user={user} />

					<UserInvitationWidget listData={listData} />

					{!isUserListOwner && <LeaveListWidget listId={listData.id} />}

					{isUserListOwner && <DeleteListWidget listId={listData.id} />}
				</MoreActionsWidget>
			</CreateTaskWidget>

			{tasks.length !== 0 ? (
				<ul className="flex flex-col space-y-4 xl:space-y-2 py-2">{tasks}</ul>
			) : (
				<span className="px-4 text-gray-400 text-sm text-center">
					No tasks yet
				</span>
			)}
		</div>
	);
}
