import { Dialog } from '@headlessui/react';
import { useFetcher } from '@remix-run/react';
import { useState } from 'react';
import { ListType, UserType } from '~/schema/Schema';

export const ParticipantsWidget: React.FC<{
	listData: ListType;
	user: UserType;
}> = ({ listData, user }) => {
	const [isOpen, setIsOpen] = useState(false);

	const kickFetcher = useFetcher();

	return (
		<>
			<button
				onClick={() => {
					setIsOpen(true);
				}}
			>
				See participants
			</button>
			<Dialog open={isOpen} onClose={() => setIsOpen(false)}>
				<Dialog.Panel>
					<Dialog.Title>List participants</Dialog.Title>
					<Dialog.Description>List all</Dialog.Description>
					<ul>
						{Object.values(listData.participants).map(
							(participant, index) => (
								<li key={index}>
									<span>{participant.name}</span>
									{user.id === listData.author_id && (
										<kickFetcher.Form method="post" action="/lists">
											<input
												name="listId"
												type="hidden"
												value={listData.id}
											/>
											<input
												name="userId"
												type="hidden"
												value={participant.id}
											/>
											<button
												name="action"
												type="submit"
												value="kick"
											>
												Kick
											</button>
										</kickFetcher.Form>
									)}
								</li>
							)
						)}
					</ul>
				</Dialog.Panel>
			</Dialog>
		</>
	);
};
