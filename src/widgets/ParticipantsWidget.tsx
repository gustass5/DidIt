import { Form } from '@remix-run/react';
import { Button } from '~/components/Button/Button';
import { Dialog } from '~/components/Dialog/Dialog';
import { ListType, UserType } from '~/schema/Schema';

export const ParticipantsWidget: React.FC<{
	listData: ListType;
	user: UserType;
}> = ({ listData, user }) => {
	return (
		<Dialog
			title="Participants"
			description="List of all list participants"
			button={
				<Button className="text-sm text-blue-400 border-blue-400">
					See participants
				</Button>
			}
		>
			<ul>
				{Object.values(listData.participants).map(participant => (
					<li
						key={participant.id}
						className="flex items-center justify-between mb-4"
					>
						<div className="flex flex-col text-gray-400">
							<span>{participant.name}</span>
							<span className="text-sm">{participant.email}</span>
						</div>
						{user.id === listData.author_id && (
							<Form method="post" action="/lists">
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
								<Button
									className="text-sm px-4 text-[#F64668] border-[#F64668]"
									name="action"
									type="submit"
									value="kick"
								>
									Kick
								</Button>
							</Form>
						)}
					</li>
				))}
			</ul>
		</Dialog>
	);
};
