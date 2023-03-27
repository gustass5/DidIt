import { Dialog } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { Button } from '~/components/Button/Button';

export const MoreActionsWidget: React.FC<{ children: React.ReactNode }> = ({
	children
}) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<Button
				onClick={() => setIsOpen(true)}
				className="text-blue-400 border-blue-400 px-1"
			>
				<EllipsisVerticalIcon className="h-6 w-8" />
			</Button>

			<Dialog
				open={isOpen}
				onClose={() => setIsOpen(false)}
				className="relative z-50"
			>
				<div className="fixed inset-0 bg-black/30" aria-hidden="true" />
				<div className="fixed inset-0 flex items-center justify-center p-4">
					<Dialog.Panel className="w-full max-w-sm rounded bg-white">
						<Dialog.Title>Task actions</Dialog.Title>
						<Dialog.Description>
							Additional actions available to you
						</Dialog.Description>

						{children}
					</Dialog.Panel>
				</div>
			</Dialog>
		</>
	);
};
