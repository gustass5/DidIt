import { useFetcher } from '@remix-run/react';
import { Button } from '~/components/Button/Button';
import { TaskType, UserType } from '~/schema/Schema';

export const SetCompleteWidget: React.FC<{ task: TaskType; user: UserType }> = ({
	task,
	user
}) => {
	const completeFetcher = useFetcher();

	return (
		<completeFetcher.Form method="post">
			<input name="taskId" type="hidden" value={task.id} />

			<Button
				name="action"
				value="complete"
				color={task.completed[user.id] ? 'green-400' : 'indigo-400'}
				className="w-32"
				disabled={!task.responsible[user.id]}
			>
				{task.completed[user.id] ? 'UNSET' : 'COMPLETE'}
			</Button>
		</completeFetcher.Form>
	);
};
