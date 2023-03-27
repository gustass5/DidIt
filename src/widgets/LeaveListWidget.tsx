import { Form } from '@remix-run/react';
import { Button } from '~/components/Button/Button';

export const LeaveListWidget: React.FC<{ listId?: string }> = ({ listId }) => (
	<Form method="post" action="/lists">
		<input name="listId" type="hidden" value={listId} />

		<Button
			name="action"
			value="leave"
			className="w-32 text-sm text-teal-400 border-teal-400"
		>
			Leave list
		</Button>
	</Form>
);
