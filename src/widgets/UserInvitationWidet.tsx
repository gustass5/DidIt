import { Combobox } from '@headlessui/react';
import { Dialog } from '~/components/Dialog/Dialog';

import { Form, useFetcher } from '@remix-run/react';
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
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/outline';
import { Alert } from '~/components/Alert/Alert';

type ComboboxUserType = (UserType & {
	invited: boolean;
	participant: boolean;
})[];

export const UserInvitationWidget: React.FC<{
	listData: ListType;
}> = ({ listData }) => {
	const [users, setUsers] = useState<UserType[]>([]);

	const [invitations, setInvitations] = useState<InvitationType[]>([]);

	const [filteredUsers, setFilteredUsers] = useState<ComboboxUserType>([]);

	const [selectedUsers, setSelectedUsers] = useState<ComboboxUserType>([]);

	const [query, setQuery] = useState('');

	const usersFetcher = useFetcher();

	const invitationsFetcher = useFetcher();

	useEffect(() => {
		usersFetcher.submit({}, { method: 'post', action: '/api/users' });
		invitationsFetcher.submit(
			{
				listId: listData.id || '',
				'status[0]': InvitationStatusEnum.enum.pending
			},
			{ method: 'post', action: '/api/invitations/list' }
		);
	}, []);

	useEffect(() => {
		if (usersFetcher.type !== 'done') {
			return;
		}

		if (!usersFetcher.data.success) {
			Alert.fire({
				icon: 'error',
				title: 'Error',
				text: invitationsFetcher.data.error
			});

			return;
		}

		if (usersFetcher.data?.users == undefined) {
			Alert.fire({
				icon: 'error',
				title: 'Error',
				text: 'Unable to retrieve users'
			});
			return;
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
			<Dialog
				title="Invite users"
				description="Search for users to invite"
				button={
					<Button className="text-sm text-indigo-400 border-indigo-400">
						Invite users
					</Button>
				}
			>
				<Form method="post" action={`/lists/${listData.id}`}>
					<input name="listId" type="hidden" value={listData.id} />
					<input name="listName" type="hidden" value={listData.name} />
					<Combobox
						value={selectedUsers}
						onChange={users => {
							setSelectedUsers(users);
						}}
						name="invited"
						multiple
					>
						<div className="relative mt-1">
							<div className="relative w-full border-none cursor-default overflow-hidden text-left focus:outline-none sm:text-sm">
								<Combobox.Input
									placeholder="User name/email"
									className="w-full border-none bg-transparent py-2 pl-3 pr-10 text-sm leading-5 text-gray-400 focus:outline-none"
									displayValue={users => {
										return (users as z.infer<typeof UserSchema>[])
											.map(user => user.name)
											.join(', ');
									}}
									onChange={event => setQuery(event.target.value)}
								/>
								<Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
									<ChevronUpDownIcon
										className="h-5 w-5 text-teal-400"
										aria-hidden="true"
									/>
								</Combobox.Button>
							</div>

							<Combobox.Options className="absolute mt-1 max-h-60 w-full bg-gray-950 text-gray-400 overflow-auto rounded-md py-1 text-base shadow-lg focus:outline-none sm:text-sm">
								{filteredUsers.length === 0 && query !== '' ? (
									<div className="relative cursor-default select-none py-2 px-4 ">
										Nothing found.
									</div>
								) : (
									filteredUsers.map(user => (
										<Combobox.Option
											key={user.id}
											className={({ active }) =>
												`relative cursor-pointer select-none py-2 pl-10 pr-4 ${
													active
														? 'bg-teal-950 text-white'
														: 'text-gray-900'
												}`
											}
											value={user}
										>
											{({ selected, active }) => (
												<>
													<span
														className={`block truncate text-gray-400 pl-3 ${
															selected
																? 'font-medium'
																: 'font-normal'
														}`}
													>
														{user.name}
													</span>
													<span
														className={`block truncate text-xs text-gray-400 pl-3 ${
															selected
																? 'font-medium'
																: 'font-normal'
														}`}
													>
														{user.email}{' '}
														{user.participant
															? '- This user is already in the list'
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
															<CheckIcon
																className="h-5 w-5"
																aria-hidden="true"
															/>
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

					<Button
						className="text-sm px-4 my-4 text-teal-400 border-teal-400 w-full"
						type="submit"
						name="action"
						value="invite"
					>
						Invite
					</Button>
				</Form>
			</Dialog>
		</>
	);
};
