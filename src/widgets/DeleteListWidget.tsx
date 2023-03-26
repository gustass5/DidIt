import { Form } from '@remix-run/react';
import { Button } from '~/components/Button/Button';

export const DeleteListWidget: React.FC<{ listId?: string }> = ({ listId }) => (
	<Form method="post" action="/lists">
		<input name="listId" type="hidden" value={listId} />

		<Button
			name="action"
			value="delete"
			className="w-32 text-sm text-[#F64668] border-[#F64668]"
		>
			Delete list
		</Button>
	</Form>
);
