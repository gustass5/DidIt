import { Dialog } from '~/components/Dialog/Dialog';
import { useFetcher } from '@remix-run/react';
import { Button } from '~/components/Button/Button';
import { TaskType } from '~/schema/Schema';

export const UpdateTaskWidget: React.FC<{ task: TaskType }> = ({ task }) => {
	const updateFetcher = useFetcher();

	return (
		<Dialog
			title="Update task"
			description="This will update task"
			button={
				<Button className="w-full text-blue-400 border-blue-400">UPDATE</Button>
			}
		>
			<updateFetcher.Form method="post" className="flex flex-col">
				<input name="taskId" type="hidden" value={task.id} />

				<input
					name="name"
					type="text"
					placeholder="Name"
					defaultValue={task.name}
					className="bg-transparent outline-none text-gray-400 pb-6"
				/>

				<input
					name="labels"
					type="text"
					placeholder="Label(s)"
					defaultValue={task.labels}
					className="bg-transparent outline-none text-gray-400 pb-6"
				/>

				<Button
					className="text-sm px-4 text-indigo-400 border-indigo-400"
					name="action"
					type="submit"
					value="update"
				>
					Update
				</Button>
			</updateFetcher.Form>
		</Dialog>
	);
};
