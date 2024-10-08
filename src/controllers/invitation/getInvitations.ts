import { z } from 'zod';
import { ActionError } from '~/errors/ActionError';
import { FirebaseServer } from '~/firebase/server/firebase.server';
import {
	InvitationType,
	InvitationSchema,
	InvitationStatusEnum
} from '~/schema/Schema';

export const getInvitations = async ({
	listId,
	userId,
	status = []
}: {
	listId?: string;
	userId?: string;
	status?: z.infer<typeof InvitationStatusEnum>[];
}): Promise<InvitationType[]> => {
	const invitationsCollection = FirebaseServer.database.collection(`invitations`);

	let invitationsQuery;

	if (listId) {
		invitationsQuery = invitationsCollection
			.where('list.id', '==', listId)
			.where('status', 'in', status);
	} else if (userId) {
		invitationsQuery = invitationsCollection
			.where('invited.id', '==', userId)
			.where('status', 'in', status);
	} else {
		throw new ActionError('Query must be provided with either listId, userId');
	}

	const invitationsSnapshot = await invitationsQuery.get();

	const invitationsDocuments = invitationsSnapshot.docs.map(doc =>
		InvitationSchema.parse({ id: doc.id, ...doc.data() })
	);

	return invitationsDocuments;
};
