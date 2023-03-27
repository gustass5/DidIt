import { Combobox, Dialog } from '@headlessui/react';
import { useFetcher } from '@remix-run/react';
import { useState, useEffect } from 'react';
import { z } from 'zod';
import { Button } from '~/components/Button/Button';
import {
	InvitationSchema,
	InvitationStatusEnum,
	UserSchema,
	ListType,
	UserType,
	InvitationType
} from '~/schema/Schema';

type ComboboxUserType = (UserType & {
	invited: boolean;
	participant: boolean;
})[];

export const UserInvitationWidget: React.FC<{
	listData: ListType;
}> = ({ listData }) => {
	const [isOpen, setIsOpen] = useState(false);

	const [users, setUsers] = useState<UserType[]>([]);

	const [invitations, setInvitations] = useState<InvitationType[]>([]);

	const [filteredUsers, setFilteredUsers] = useState<ComboboxUserType>([]);

	const [selectedUsers, setSelectedUsers] = useState<ComboboxUserType>([]);

	const [query, setQuery] = useState('');

	const usersFetcher = useFetcher();

	const invitationsFetcher = useFetcher();

	const inviteUserFetcher = useFetcher();

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		usersFetcher.submit({}, { method: 'post', action: '/api/users' });
		invitationsFetcher.submit(
			{
				listId: listData.id || '',
				'status[0]': InvitationStatusEnum.enum.pending
			},
			{ method: 'post', action: '/api/invitations/list' }
		);
	}, [isOpen]);

	useEffect(() => {
		if (usersFetcher.type !== 'done') {
			return;
		}

		if (usersFetcher.data?.users == undefined) {
			throw new Error('Unable to retrieve users');
		}

		const users = Array.from(usersFetcher.data.users).map(user =>
			UserSchema.parse(user)
		);

		setUsers(users);
	}, [usersFetcher]);

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

	useEffect(() => {
		const checkInvited = (users: UserType[]) =>
			users.map(user => ({
				...user,
				invited:
					invitations.find(
						invitation => invitation.invited.id === user.id
					) !== undefined,
				participant: listData.participants[user.id] !== undefined
			}));

		if (query === '') {
			setFilteredUsers(checkInvited(users));
			return;
		}

		setFilteredUsers(
			checkInvited(
				users.filter(
					user =>
						user.name
							.toLowerCase()
							.replace(/\s+/g, '')
							.includes(query.toLowerCase().replace(/\s+/g, '')) ||
						user.email
							.toLowerCase()
							.replace(/\s+/g, '')
							.includes(query.toLowerCase().replace(/\s+/g, ''))
				)
			)
		);
	}, [query, users, invitations]);

	return (
		<>
			<Button
				onClick={() => setIsOpen(true)}
				className="w-32 text-sm text-indigo-400 border-indigo-400"
			>
				Invite users
			</Button>
			<Dialog
				open={isOpen}
				onClose={() => setIsOpen(false)}
				className="relative z-50"
			>
				<div className="fixed inset-0 bg-black/30" aria-hidden="true" />
				<div className="fixed inset-0 flex items-center justify-center p-4">
					<Dialog.Panel className="w-full max-w-sm rounded bg-white">
						<Dialog.Title>Invite users</Dialog.Title>
						<Dialog.Description>
							This will update list name
						</Dialog.Description>

						<inviteUserFetcher.Form method="post" action="/lists">
							<input name="listId" type="hidden" value={listData.id} />
							<input
								name="listName"
								type="hidden"
								value={listData.name}
							/>
							<Combobox
								value={selectedUsers}
								onChange={users => {
									console.log('selected', selectedUsers);
									setSelectedUsers(users);
								}}
								name="invited"
								multiple
							>
								<div className="relative mt-1">
									<div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
										<Combobox.Input
											className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
											displayValue={users => {
												return (
													users as z.infer<
														typeof UserSchema
													>[]
												)
													.map(user => user.name)
													.join(', ');
											}}
											onChange={event =>
												setQuery(event.target.value)
											}
										/>
										<Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
											{/* <ChevronUpDownIcon
								className="h-5 w-5 text-gray-400"
								aria-hidden="true"
							/> */}
										</Combobox.Button>
									</div>

									<Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
										{filteredUsers.length === 0 && query !== '' ? (
											<div className="relative cursor-default select-none py-2 px-4 text-gray-700">
												Nothing found.
											</div>
										) : (
											filteredUsers.map(user => (
												<Combobox.Option
													key={user.id}
													className={({ active }) =>
														`relative cursor-default select-none py-2 pl-10 pr-4 ${
															active
																? 'bg-teal-600 text-white'
																: 'text-gray-900'
														}`
													}
													value={user}
												>
													{({ selected, active }) => (
														<>
															<span
																className={`block truncate ${
																	selected
																		? 'font-medium'
																		: 'font-normal'
																}`}
															>
																{user.name}
															</span>
															<span
																className={`block truncate text-xs text-gray-400 ${
																	selected
																		? 'font-medium'
																		: 'font-normal'
																}`}
															>
																{user.email}{' '}
																{user.participant
																	? '- This user is already in the list invited'
																	: user.invited
																	? '- This user has already been invited'
																	: ''}
															</span>
															{selected ? (
																<span
																	className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
																		active
																			? 'text-white'
																			: 'text-teal-600'
																	}`}
																>
																	{/* <CheckIcon
														className="h-5 w-5"
														aria-hidden="true"
													/> */}
																</span>
															) : null}
														</>
													)}
												</Combobox.Option>
											))
										)}
									</Combobox.Options>
								</div>
							</Combobox>
							<button name="action" type="submit" value="invite">
								Invite
							</button>
						</inviteUserFetcher.Form>
					</Dialog.Panel>
				</div>
			</Dialog>
		</>
	);
};
