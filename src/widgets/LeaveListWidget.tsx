import { Form } from '@remix-run/react';
import { useState } from 'react';
import { Button } from '~/components/Button/Button';

export const LeaveListWidget: React.FC<{ listId?: string }> = ({ listId }) => {
	const [confirmed, setConfirmed] = useState(false);

	if (!confirmed) {
		return (
			<Button
				name="action"
				value="leave"
				type="button"
				onClick={() => setConfirmed(true)}
				className="w-full text-sm text-teal-400 border-teal-400"
			>
				LEAVE LIST
			</Button>
		);
	}

	return (
		<Form method="post" action="/lists">
			<input name="listId" type="hidden" value={listId} />

			<Button
				name="action"
				value="leave"
				className="w-full text-sm text-teal-400 border-teal-400"
			>
				LEAVE LIST (CONFIRM)
			</Button>
		</Form>
	);
};
