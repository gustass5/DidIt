import { Form } from '@remix-run/react';

export const DeleteListWidget: React.FC<{ listId?: string }> = ({ listId }) => (
	<Form method="post" action="/lists">
		<button name="action" value="delete">
			<input name="listId" type="hidden" value={listId} />
			Delete list
		</button>
	</Form>
);
