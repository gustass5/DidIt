import { TaskType, UserType } from '~/schema/Schema';
import { SetCompleteWidget } from '~/widgets/SetCompleteWidget';
import { SetResponsibleWidget } from '~/widgets/SetResponsibleWidget';
import { ResponsibleImage } from '../ResponsibleImage/ResponsibleImage';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import { MoreActionsWidget } from '~/widgets/MoreActionsWidget';
import { UpdateTaskWidget } from '~/widgets/UpdateTaskWidget';
import { DeleteTaskWidget } from '~/widgets/DeleteTaskWidget';

export const TaskRow: React.FC<{
	task: TaskType;
	user: UserType;
	isUserListOwner: boolean;
}> = ({ task, user, isUserListOwner }) => {
	const isUserTaskCreator = task.author_id === user.id;

	const isUserTaskParticipant = task.responsible[user.id] !== undefined;

	const taskResponsible = Object.values(task.responsible);

	const getBorderColor = () => {
		if (Object.values(task.completed).includes(true)) {
			return 'border-green-400';
		}

		if (taskResponsible.length !== 0) {
			return 'border-indigo-400';
		}

		return 'border-gray-400';
	};

	const participantsButtons = (
		<>
			{isUserTaskParticipant && <SetCompleteWidget task={task} user={user} />}

			{!isUserTaskParticipant && <SetResponsibleWidget task={task} user={user} />}
		</>
	);

	const labels = task.labels.split('|').filter(label => label !== '');

	return (
		<li
			className={`flex justify-between items-center p-4 rounded text-gray-400 bg-gray-900 border ${getBorderColor()}`}
		>
			<div className="flex flex-col xl:flex-row -space-y-2 xl:-space-y-0 xl:-space-x-2 w-16 items-center justify-center">
				<ResponsibleImage image={taskResponsible[0]?.image} />

				<ResponsibleImage image={taskResponsible[1]?.image} />

				{taskResponsible.length <= 0 && (
					<UserCircleIcon className="h-9 w-9 text-gray-400" />
				)}

				{taskResponsible.length >= 3 && (
					<PlusCircleIcon className="h-9 w-9 text-gray-400" />
				)}
			</div>

			<div
				className={`flex w-full flex-col overflow-hidden ${
					labels.length > 0 ? '-mt-4' : ''
				}`}
			>
				{labels.length > 0 && (
					<div className="flex space-x-1">
						{labels.map(label => (
							<div
								key={label}
								className="text-[10px] text-emerald-400 border border-emerald-400 rounded-full px-2 my-1"
							>
								{label.length > 12
									? `${label.substring(0, 12)}...`
									: label}
							</div>
						))}
					</div>
				)}

				<div className="text-sm xl:text-base">{task.name}</div>
			</div>

			<div className="flex space-x-2 pl-6">
				<div className="hidden xl:block xl:w-32">{participantsButtons}</div>
				<MoreActionsWidget>
					<div className="flex flex-col space-y-4">
						{isUserTaskParticipant && (
							<SetResponsibleWidget task={task} user={user} />
						)}

						<div className="flex flex-col w-full xl:hidden">
							{participantsButtons}
						</div>

						<UpdateTaskWidget task={task} />

						{(isUserListOwner || isUserTaskCreator) && (
							<DeleteTaskWidget task={task} />
						)}
					</div>
				</MoreActionsWidget>
			</div>
		</li>
	);
};
