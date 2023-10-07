import { TaskType } from '~/schema/Schema';
import { Dialog as HeadlessDialog } from '@headlessui/react';
import { ResponsibleImage } from '~/components/ResponsibleImage/ResponsibleImage';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

export const SeeTaskParticipantsWidget: React.FC<{
	taskData: TaskType;
}> = ({ taskData }) => {
	const [isOpen, setIsOpen] = useState(false);

	const taskResponsible = Object.values(taskData.responsible);

	return (
		<>
			<div
				onClick={() => setIsOpen(true)}
				className="flex flex-col xl:flex-row -space-y-2 xl:-space-y-0 xl:-space-x-2 w-16 items-center justify-center cursor-pointer"
			>
				<ResponsibleImage image={taskResponsible[0]?.image} />

				<ResponsibleImage image={taskResponsible[1]?.image} />

				{taskResponsible.length <= 0 && (
					<UserCircleIcon className="h-8 w-8 text-gray-400" />
				)}

				{taskResponsible.length >= 3 && (
					<PlusCircleIcon className="h-9 w-9 text-gray-400" />
				)}
			</div>

			<HeadlessDialog
				open={isOpen}
				onClose={() => setIsOpen(false)}
				className="relative z-50"
			>
				<div
					className="fixed inset-0 bg-black/50 backdrop-blur"
					aria-hidden="true"
				/>
				<div className="fixed inset-0 flex items-center justify-center p-4">
					<HeadlessDialog.Panel className="w-full xl:max-w-xl rounded bg-gray-900 border-2 border-gray-600">
						<div className="bg-[#111319] rounded p-6 space-y-2">
							<HeadlessDialog.Title className="text-xl font-semibold text-orange-400 uppercase shadow">
								Responsible participants
							</HeadlessDialog.Title>
							<HeadlessDialog.Description className="text-md  text-gray-400">
								See users responsible for task completion
							</HeadlessDialog.Description>
						</div>
						<div
							onSubmit={() => {
								setIsOpen(false);
							}}
							className="p-6"
						>
							<ul>
								{Object.values(taskData.responsible).map(
									responsible => (
										<li
											key={responsible.id}
											className="flex xl:items-center xl:justify-between mb-4 flex-col xl:flex-row"
										>
											<div className="flex flex-col text-gray-400 mb-1">
												<span>{responsible.name}</span>
												<span className="text-sm">
													{responsible.email}
												</span>
											</div>

											<div
												className={`text-sm
                                                ${
													taskData.completed[responsible.id]
														? 'text-green-400'
														: 'text-indigo-400'
												}
                                                `}
											>
												{taskData.completed[responsible.id]
													? 'COMPLETED'
													: 'NOT COMPLETED'}
											</div>
										</li>
									)
								)}

								{Object.values(taskData.responsible).length <= 0 && (
									<div className="text-gray-500">No participants</div>
								)}
							</ul>
						</div>
					</HeadlessDialog.Panel>
				</div>
			</HeadlessDialog>
		</>
	);
};
