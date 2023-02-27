import qs from 'qs';
import { z } from 'zod';
import { FirebaseServer } from '~/firebase/server/firebase.server';
import {
	InvitationSchema,
	InvitationStatusEnum,
	ListType,
	UserSchema,
	UserType
} from '~/schema/Schema';
import { getInvitations } from '../invitation/getInvitations';
import { getList } from './getList';

const getFilteredInvitedUsers = (
	formData: FormData,
	user: UserType,
	listData: ListType
) => {
	const parsedInvitedData = getParsedData(formData);
	// [NOTE]: Currently, I am encountering a bug where you are able to submit duplicate data with headless ui Combobox, so I remove duplicates if I get any

	const invitedIds = parsedInvitedData.map(invited => invited.id);

	const filteredIds =
		// Filter duplicate ids
		Array.from(new Set(invitedIds)).filter(
			invitedId =>
				// Disallow user to invite himself
				invitedId !== user.id &&
				//Filter users that are already in the list
				listData.participants[invitedId] === undefined
		);

	return UserSchema.array().parse(
		filteredIds.map(id => parsedInvitedData.find(invited => invited.id === id))
	);
};

const getParsedData = (formData: FormData) => {
	const stringifiedFormData = qs.stringify(Object.fromEntries(formData.entries()));

	const formDataEntries = qs.parse(stringifiedFormData);

	return UserSchema.array().parse(formDataEntries['invited']);
};

export const inviteUsers = async (formData: FormData, user: UserType) => {
	const { listData } = await getList(formData, user);

	const invitations = await getInvitations({
		listId: listData.id,
		status: [InvitationStatusEnum.enum.pending]
	});

	const filteredInvitedUsers = getFilteredInvitedUsers(formData, user, listData);

	// Filter users that already have pending invitations
	const finalInvitedUsers = filteredInvitedUsers.filter(
		invited =>
			invitations.find(invitation => invitation.invited.id === invited.id) ===
			undefined
	);

	let errors: z.ZodError[] = [];

	finalInvitedUsers.forEach(invited => {
		const listName = formData.get('listName');

		const currentTimestamp = new Date().toISOString();

		/**
		 * Safe parsing because if some users somehow fail, the rest are still invited
		 */
		const newInvitation = InvitationSchema.safeParse({
			list: { id: listData.id, name: listName },
			inviter: user,
			invited,
			status: 'pending',
			created_at: currentTimestamp,
			updated_at: currentTimestamp
		});

		if (!newInvitation.success) {
			errors.push(newInvitation.error);
			return;
		}

		FirebaseServer.database.collection('invitations').add(newInvitation.data);
	});

	if (errors.length > 0) {
		throw new Error(
			`Unexpected errors occurred during invitation: ${errors
				.map(error => JSON.stringify(error))
				.join(',')}`
		);
	}
};
