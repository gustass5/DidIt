import { useFetcher } from '@remix-run/react';
import { TaskType, UserType } from '~/schema/Schema';

export const SetResponsibleWidget: React.FC<{ task: TaskType; user: UserType }> = ({
	task,
	user
}) => {
	const responsibleFetcher = useFetcher();

	return (
		<responsibleFetcher.Form method="post">
			<input name="taskId" type="hidden" value={task.id} />
			<button
				name="action"
				type="submit"
				value="responsible"
				className="font-semibold text-teal-400"
			>
				{task.responsible[user.id] ? 'LEAVE' : 'JOIN'}
			</button>
		</responsibleFetcher.Form>
	);
};
