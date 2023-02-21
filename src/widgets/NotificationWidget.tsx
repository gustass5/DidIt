import { Popover } from '@headlessui/react';
import { useFetcher } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { InvitationSchema, InvitationStatusEnum, UserSchema } from '~/schema/Schema';
import qs from 'qs';

export const NotificationWidget: React.FC<{
	user: z.infer<typeof UserSchema>;
}> = ({ user }) => {
	const invitationsFetcher = useFetcher();

	const acceptInvitationFetcher = useFetcher();

	const declineInvitationFetcher = useFetcher();

	const [invitations, setInvitations] = useState<z.infer<typeof InvitationSchema>[]>(
		[]
	);

	useEffect(() => {
		invitationsFetcher.submit(
			{
				data: qs.stringify({
					user,
					status: [InvitationStatusEnum.enum.pending]
				})
			},
			{ method: 'post', action: '/api/invitations/user' }
		);
	}, []);

	useEffect(() => {
		if (invitationsFetcher.type !== 'done') {
			return;
		}

		if (invitationsFetcher.data?.invitations == undefined) {
			throw new Error('Unable to retrieve invitations');
		}

		const invitations = Array.from(invitationsFetcher.data.invitations).map(
			invitation => InvitationSchema.parse(invitation)
		);

		setInvitations(invitations);
	}, [invitationsFetcher]);

	return (
		<Popover className="relative">
			<Popover.Button>Notifications</Popover.Button>

			<Popover.Panel className="absolute z-10">
				{invitations.map((invitation, index) => (
					<div key={index}>
						<span>
							You have been invited to join {invitation.list.name}
							by
							{invitation.inviter.name}
						</span>
						<acceptInvitationFetcher.Form
							method="post"
							action="/api/invitations/handle"
						>
							<input
								name="invitationId"
								type="hidden"
								value={invitation.id}
							/>
							<button name="action" type="submit" value="accept">
								Accept
							</button>
						</acceptInvitationFetcher.Form>

						<declineInvitationFetcher.Form
							method="post"
							action="/api/invitations/handle"
						>
							<input
								name="invitationId"
								type="hidden"
								value={invitation.id}
							/>
							<button name="action" type="submit" value="decline">
								Decline
							</button>
						</declineInvitationFetcher.Form>
					</div>
				))}
			</Popover.Panel>
		</Popover>
	);
};
