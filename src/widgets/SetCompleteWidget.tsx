import { useFetcher } from '@remix-run/react';
import { TaskType, UserType } from '~/schema/Schema';

export const SetCompleteWidget: React.FC<{ task: TaskType; user: UserType }> = ({
	task,
	user
}) => {
	const completeFetcher = useFetcher();

	return (
		<completeFetcher.Form method="post">
			<input name="taskId" type="hidden" value={task.id} />
			<button
				className={`font-semibold ${
					task.completed[user.id] ? 'text-green-400' : 'text-indigo-400'
				}`}
				name="action"
				type="submit"
				value="complete"
				disabled={!task.responsible[user.id]}
			>
				{task.completed[user.id] ? 'COMPLETED' : 'COMPLETE'}
			</button>
		</completeFetcher.Form>
	);
};
