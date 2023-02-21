import qs from 'qs';
import { z } from 'zod';
import { FirebaseServer } from '~/firebase/server/firebase.server';
import { getListId } from '~/helpers/getListId';
import {
	InvitationSchema,
	InvitationStatusEnum,
	ListSchema,
	UserSchema
} from '~/schema/Schema';
import { getInvitations } from '../invitation/getInvitations';

export const inviteUsers = async (
	formData: FormData,
	user: z.infer<typeof UserSchema>
) => {
	const listId = getListId(formData);

	let errors: z.ZodError[] = [];

	const stringifiedFormData = qs.stringify(Object.fromEntries(formData.entries()));

	const formDataEntries = qs.parse(stringifiedFormData);

	const parsedInvitedData = UserSchema.array().parse(formDataEntries['invited']);

	const listsSnapshot = await FirebaseServer.database
		.collection('lists')
		.doc(listId)
		.get();

	if (!listsSnapshot.exists) {
		throw new Error('List does not exist');
	}

	const listData = ListSchema.parse(listsSnapshot.data());

	// [NOTE]: Currently, I am encountering a bug where you are able to submit duplicate data with headless ui Combobox, so I remove duplicates if I get any

	const invitedIds = parsedInvitedData.map(invited => invited.id);

	// Filter duplicate ids, users that are already in the list and disallow user to invite himself
	const filteredIds = Array.from(new Set(invitedIds)).filter(
		invitedId =>
			invitedId !== user.id && listData.participants[invitedId] !== undefined
	);

	const filteredInvited = UserSchema.array().parse(
		filteredIds.map(id => parsedInvitedData.find(invited => invited.id === id))
	);

	const invitations = await getInvitations({
		listId,
		status: [InvitationStatusEnum.enum.pending]
	});

	const invited = filteredInvited.filter(
		invited =>
			invitations.find(invitation => invitation.invited.id === invited.id) ===
			undefined
	);

	invited.forEach(invited => {
		const listName = formData.get('listName');

		const currentTimestamp = new Date().toISOString();

		/**
		 * Safe parsing because if some users somehow fail, the rest are still invited
		 */
		const newInvitation = InvitationSchema.safeParse({
			list: { id: listId, name: listName },
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
