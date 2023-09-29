import { Form } from '@remix-run/react';
import { Button } from '~/components/Button/Button';
import { TaskType } from '~/schema/Schema';

export const DeleteTaskWidget: React.FC<{ task: TaskType }> = ({ task }) => {
	return (
		<Form method="post">
			<input name="taskId" type="hidden" value={task.id} />
			<Button
				name="action"
				value="delete"
				className="w-full text-[#F64668] border-[#F64668]"
			>
				DELETE
			</Button>
		</Form>
	);
};
