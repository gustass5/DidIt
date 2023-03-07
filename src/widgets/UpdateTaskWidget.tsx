import { Dialog } from '@headlessui/react';
import { useFetcher } from '@remix-run/react';
import { useState } from 'react';
import { TaskType } from '~/schema/Schema';

export const UpdateTaskWidget: React.FC<{ task: TaskType }> = ({ task }) => {
	const updateFetcher = useFetcher();

	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<button
				onClick={() => setIsOpen(true)}
				className="font-semibold text-blue-400 border py-2 px-4 rounded w-24 border-blue-400"
			>
				UPDATE
			</button>

			<Dialog
				open={isOpen}
				onClose={() => setIsOpen(false)}
				className="relative z-50"
			>
				<div className="fixed inset-0 bg-black/30" aria-hidden="true" />
				<div className="fixed inset-0 flex items-center justify-center p-4">
					<Dialog.Panel className="w-full max-w-sm rounded bg-white">
						<Dialog.Title>Update task</Dialog.Title>
						<Dialog.Description>This will update task</Dialog.Description>

						<updateFetcher.Form method="post">
							<input name="taskId" type="hidden" value={task.id} />
							<input
								name="name"
								type="text"
								placeholder="Name"
								defaultValue={task.name}
							/>
							<input
								name="labels"
								type="text"
								placeholder="Label(s)"
								defaultValue={task.labels}
							/>
							<button name="action" type="submit" value="update">
								Update
							</button>
						</updateFetcher.Form>
					</Dialog.Panel>
				</div>
			</Dialog>
		</>
	);
};
