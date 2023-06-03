import { Popover } from '@headlessui/react';
import { useFetcher } from '@remix-run/react';
import { useEffect, useState } from 'react';
import {
	InvitationSchema,
	InvitationStatusEnum,
	UserType,
	InvitationType
} from '~/schema/Schema';
import qs from 'qs';
import { BellAlertIcon, BellIcon } from '@heroicons/react/24/outline';

export const NotificationWidget: React.FC<{
	user: UserType;
}> = ({ user }) => {
	const invitationsFetcher = useFetcher();

	const acceptInvitationFetcher = useFetcher();

	const declineInvitationFetcher = useFetcher();

	const [invitations, setInvitations] = useState<InvitationType[]>([]);

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
			<Popover.Button className="flex items-center justify-center mx-2 outline-none">
				{invitations.length > 0 ? (
					<div className="relative">
						<BellAlertIcon className="h-8 w-8 text-gray-700" />
						<div className="absolute top-0 right-0 rounded-full bg-amber-600 w-2 h-2"></div>
					</div>
				) : (
					<BellIcon className="h-8 w-8 text-gray-700" />
				)}
			</Popover.Button>

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
