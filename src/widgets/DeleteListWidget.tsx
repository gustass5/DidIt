import { Form } from '@remix-run/react';
import { useState } from 'react';
import { Button } from '~/components/Button/Button';

export const DeleteListWidget: React.FC<{ listId?: string }> = ({ listId }) => {
	const [confirmed, setConfirmed] = useState(false);

	if (!confirmed) {
		return (
			<Button
				name="action"
				value="delete"
				type="button"
				onClick={() => setConfirmed(true)}
				className="w-full text-[#F64668] border-[#F64668]"
			>
				DELETE LIST
			</Button>
		);
	}

	return (
		<Form method="post" action="/lists">
			<input name="listId" type="hidden" value={listId} />

			<Button
				name="action"
				value="delete"
				className="w-full text-sm text-[#F64668] border-[#F64668]"
			>
				DELETE LIST (CONFIRM)
			</Button>
		</Form>
	);
};
