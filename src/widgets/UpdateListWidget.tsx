import { Dialog } from '~/components/Dialog/Dialog';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { useFetcher } from '@remix-run/react';
import { ListType } from '~/schema/Schema';
import { Button } from '~/components/Button/Button';

export const UpdateListWidget: React.FC<{ list: ListType }> = ({ list }) => {
	const updateFetcher = useFetcher();

	return (
		<Dialog
			title="Update list name"
			description="This will update list name"
			button={
				<PencilSquareIcon className="h-6 w-6 text-gray-300 cursor-pointer" />
			}
		>
			<updateFetcher.Form method="post" action="/lists" className="flex flex-col">
				<input name="listId" type="hidden" value={list.id} />

				<input
					name="name"
					type="text"
					placeholder="Name"
					defaultValue={list.name}
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
