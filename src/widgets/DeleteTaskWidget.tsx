import { useFetcher } from '@remix-run/react';
import { Button } from '~/components/Button/Button';
import { TaskType } from '~/schema/Schema';

export const DeleteTaskWidget: React.FC<{ task: TaskType }> = ({ task }) => {
	const deleteFetcher = useFetcher();

	return (
		<deleteFetcher.Form method="post">
			<input name="taskId" type="hidden" value={task.id} />
			<Button
				name="action"
				color="#F64668"
				className="text-[#F64668] border-[#F64668]"
			>
				DELETE
			</Button>
		</deleteFetcher.Form>
	);
};
