import { Form } from '@remix-run/react';
import { useState } from 'react';
import { Button } from '~/components/Button/Button';

export const KickUserWidget: React.FC<{ listId?: string; participantId?: string }> = ({
	listId,
	participantId
}) => {
	const [confirmed, setConfirmed] = useState(false);

	if (!confirmed) {
		return (
			<Button
				type="button"
				onClick={() => setConfirmed(true)}
				className="text-sm px-4 text-[#F64668] border-[#F64668]"
			>
				KICK
			</Button>
		);
	}

	return (
		<Form method="post" action="/lists">
			<input name="listId" type="hidden" value={listId} />
			<input name="userId" type="hidden" value={participantId} />
			<Button
				className="text-sm px-4 text-[#F64668] border-[#F64668]"
				name="action"
				type="submit"
				value="kick"
			>
				KICK (CONFIRM)
			</Button>
		</Form>
	);
};
