import { Dialog } from '@headlessui/react';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { useFetcher } from '@remix-run/react';
import { useState } from 'react';
import { ListType } from '~/schema/Schema';

export const UpdateListWidget: React.FC<{ list: ListType }> = ({ list }) => {
	const updateFetcher = useFetcher();

	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<button onClick={() => setIsOpen(true)}>
				<PencilSquareIcon className="h-6 w-6 text-gray-300" />
			</button>

			<Dialog
				open={isOpen}
				onClose={() => setIsOpen(false)}
				className="relative z-50"
			>
				<div className="fixed inset-0 bg-black/30" aria-hidden="true" />
				<div className="fixed inset-0 flex items-center justify-center p-4">
					<Dialog.Panel className="w-full max-w-sm rounded bg-white">
						<Dialog.Title>Update list name</Dialog.Title>
						<Dialog.Description>
							This will update list name
						</Dialog.Description>

						<updateFetcher.Form method="post">
							<input name="listId" type="hidden" value={list.id} />
							<input
								name="name"
								type="text"
								placeholder="Name"
								defaultValue={list.name}
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
