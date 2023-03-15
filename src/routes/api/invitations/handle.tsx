import { ActionArgs } from '@remix-run/node';
import { z } from 'zod';
import { FirebaseServer } from '~/firebase/server/firebase.server';
import { getList } from '~/controllers/list/getList';
import { InvitationSchema, InvitationStatusEnum, ListSchema } from '~/schema/Schema';
import { Session } from '~/sessions';

const InvitationActionSchema = z.union([z.literal('accept'), z.literal('decline')], {
	invalid_type_error: 'Invalid action type'
});

export const action = async ({ request }: ActionArgs) => {
	const user = await Session.isUserSessionValid(request);

	if (!user) {
		throw new Error('Not authorized');
	}

	const formData = await request.formData();

	const action = InvitationActionSchema.parse(formData.get('action'));

	const invitationId = z.string().min(1).parse(formData.get('invitationId'));

	const invitationSnapshot = await FirebaseServer.database
		.collection(`invitations`)
		.doc(invitationId)
		.get();

	if (!invitationSnapshot.exists) {
		throw new Error('Invitation does not exist');
	}

	const invitation = InvitationSchema.parse(invitationSnapshot.data());

	if (invitation.invited.id !== user.id) {
		throw new Error('You cannot access this invitation');
	}

	const currentTimestamp = new Date().toISOString();

	const newInvitationData = InvitationSchema.parse({
		...invitation,
		status:
			action === 'accept'
				? InvitationStatusEnum.enum.accepted
				: InvitationStatusEnum.enum.declined,
		updated_at: currentTimestamp
	});

	if (action === 'decline') {
		await invitationSnapshot.ref.set(newInvitationData);
		return null;
	}

	/**
	 * To get list data, formData must contain list id
	 */
	formData.append('listId', invitation.list.id);

	const { listData, listSnapshot } = await getList(formData, user, false);

	if (listData.participants[user.id]) {
		throw new Error('You are already part of the list');
	}

	const newListData = ListSchema.parse({
		...listData,
		participants: { ...listData.participants, [user.id]: user },
		updated_at: currentTimestamp
	});

	const batch = FirebaseServer.database.batch();

	batch.set(listSnapshot.ref, newListData);
	batch.set(invitationSnapshot.ref, newInvitationData);

	await batch.commit();
	return null;
};
