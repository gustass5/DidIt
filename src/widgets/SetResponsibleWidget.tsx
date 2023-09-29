import { Form } from '@remix-run/react';
import { Button } from '~/components/Button/Button';
import { TaskType, UserType } from '~/schema/Schema';

export const SetResponsibleWidget: React.FC<{ task: TaskType; user: UserType }> = ({
	task,
	user
}) => {
	return (
		<Form method="post">
			<input name="taskId" type="hidden" value={task.id} />
			<Button
				name="action"
				value="responsible"
				className="w-full px-4 text-teal-400 border-teal-400"
			>
				{task.responsible[user.id] ? 'UNASSIGN' : 'ASSIGN'}
			</Button>
		</Form>
	);
};
