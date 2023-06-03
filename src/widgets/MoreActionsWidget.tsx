import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { Button } from '~/components/Button/Button';
import { Dialog } from '~/components/Dialog/Dialog';

export const MoreActionsWidget: React.FC<{
	title?: string;
	children: React.ReactNode;
}> = ({ title = 'Task actions', children }) => (
	<Dialog
		title={title}
		description="Additional actions available to you"
		button={
			<Button className="text-blue-400 border-blue-400 px-1">
				<EllipsisVerticalIcon className="h-6 w-8" />
			</Button>
		}
	>
		<div className="flex flex-col space-y-4">{children}</div>
	</Dialog>
);
