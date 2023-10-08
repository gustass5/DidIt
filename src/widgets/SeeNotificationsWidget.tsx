import { Popover } from '@headlessui/react';
import { Form, useFetcher } from '@remix-run/react';
import { useEffect, useState } from 'react';
import {
	InvitationSchema,
	InvitationStatusEnum,
	UserType,
	InvitationType
} from '~/schema/Schema';
import qs from 'qs';
import { BellAlertIcon, BellIcon } from '@heroicons/react/24/outline';
import { Button } from '~/components/Button/Button';
import { Alert } from '~/components/Alert/Alert';

export const SeeNotificationsWidget: React.FC<{
	user: UserType;
}> = ({ user }) => {
	const invitationsFetcher = useFetcher();
	const invitationHandleFetcher = useFetcher();

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

		if (!invitationsFetcher.data.success) {
			Alert.fire({
				icon: 'error',
				title: 'Error',
				text: invitationsFetcher.data.error
			});

			return;
		}

		if (invitationsFetcher.data?.invitations == undefined) {
			Alert.fire({
				icon: 'error',
				title: 'Error',
				text: 'Unable to retrieve invitations'
			});

			return;
		}

		const invitations = Array.from(invitationsFetcher.data.invitations).map(
			invitation => InvitationSchema.parse(invitation)
		);

		setInvitations(invitations);
	}, [invitationsFetcher]);

	useEffect(() => {
		if (invitationHandleFetcher.type !== 'done') {
			return;
		}

		if (!invitationHandleFetcher.data.success) {
			Alert.fire({
				icon: 'error',
				title: 'Error',
				text: invitationHandleFetcher.data.error
			});

			return;
		}
		Alert.fire({
			icon: 'success',
			title: 'Success',
			text: invitationHandleFetcher.data.successMessage
		});
	}, [invitationHandleFetcher]);

	return (
		<Popover>
			<Popover.Button className="flex items-center justify-center mx-2 outline-none">
				{invitations.length > 0 ? (
					<div className="relative">
						<BellAlertIcon className="h-8 w-8 text-gray-400" />
						<div className="absolute top-0 right-0 rounded-full bg-amber-600 w-2 h-2"></div>
					</div>
				) : (
					<BellIcon className="h-8 w-8 text-gray-400" />
				)}
			</Popover.Button>

			<Popover.Panel className="flex flex-col space-y-6 p-4 m-6 absolute z-10 right-0 rounded bg-gray-900 border-2 border-gray-600">
				{invitations.map(invitation => (
					<div key={invitation.id} className="text-gray-400">
						<div className="pb-2">
							<div>
								You have been invited to join
								<span className="font-semibold text-orange-400">
									{' '}
									{invitation.list.name}
								</span>
							</div>
							<div>
								by
								<span className="font-semibold text-orange-400">
									{' '}
									{invitation.inviter.name}
								</span>
							</div>
						</div>
						<div className="flex w-full space-x-2">
							<invitationHandleFetcher.Form
								method="post"
								action="/api/invitations/handle"
								className="w-full"
							>
								<input
									name="invitationId"
									type="hidden"
									value={invitation.id}
								/>
								<Button
									name="action"
									value="accept"
									className="w-full text-sm text-green-400 border-green-400"
								>
									Accept
								</Button>
							</invitationHandleFetcher.Form>

							<invitationHandleFetcher.Form
								method="post"
								action="/api/invitations/handle"
								className="w-full"
							>
								<input
									name="invitationId"
									type="hidden"
									value={invitation.id}
								/>

								<Button
									name="action"
									value="decline"
									className="w-full text-sm text-[#F64668] border-[#F64668]"
								>
									Decline
								</Button>
							</invitationHandleFetcher.Form>
						</div>
					</div>
				))}
			</Popover.Panel>
		</Popover>
	);
};
