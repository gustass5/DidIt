import { useFetcher } from '@remix-run/react';
import { TaskType } from '~/schema/Schema';

export const DeleteTaskWidget: React.FC<{ task: TaskType }> = ({ task }) => {
	const deleteFetcher = useFetcher();

	return (
		<deleteFetcher.Form method="post">
			<input name="taskId" type="hidden" value={task.id} />
			<button name="action" type="submit" value="delete">
				delete
			</button>
		</deleteFetcher.Form>
	);
};
