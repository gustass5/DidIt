import { useFetcher } from '@remix-run/react';
import { Button } from '~/components/Button/Button';
import { TaskType, UserType } from '~/schema/Schema';

export const SetResponsibleWidget: React.FC<{ task: TaskType; user: UserType }> = ({
	task,
	user
}) => {
	const responsibleFetcher = useFetcher();

	return (
		<responsibleFetcher.Form method="post">
			<input name="taskId" type="hidden" value={task.id} />
			<Button
				name="action"
				value="responsible"
				className="w-full text-teal-400 border-teal-400"
			>
				{task.responsible[user.id] ? 'LEAVE' : 'JOIN'}
			</Button>
		</responsibleFetcher.Form>
	);
};
