import { Form } from '@remix-run/react';

export const LeaveListWidget: React.FC<{ listId?: string }> = ({ listId }) => (
	<Form method="post" action="/lists">
		<button name="action" value="leave">
			<input name="listId" type="hidden" value={listId} />
			Leave list
		</button>
	</Form>
);
