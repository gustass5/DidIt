import { Form } from '@remix-run/react';
import { Button } from '~/components/Button/Button';
import { TaskType, UserType } from '~/schema/Schema';

export const SetCompleteWidget: React.FC<{ task: TaskType; user: UserType }> = ({
	task,
	user
}) => {
	return (
		<Form method="post">
			<input name="taskId" type="hidden" value={task.id} />

			<Button
				name="action"
				value="complete"
				className={`w-full px-4 xl:w-32 ${
					task.completed[user.id]
						? 'text-green-400 border-green-400'
						: 'text-indigo-400 border-indigo-400'
				}`}
				disabled={!task.responsible[user.id]}
			>
				{task.completed[user.id] ? 'UNSET' : 'COMPLETE'}
			</Button>
		</Form>
	);
};
