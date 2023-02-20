import { z } from 'zod';
import { FirebaseServer } from '~/firebase/server/firebase.server';
import { InvitationSchema, InvitationStatusEnum } from '~/schema/Schema';

export const getInvitations = async (
	listId: string,
	status: z.infer<typeof InvitationStatusEnum>[]
): Promise<z.infer<typeof InvitationSchema>[]> => {
	let invitationsSnapshot;

	if (status.length !== 0) {
		invitationsSnapshot = await FirebaseServer.database
			.collection(`invitations`)
			.where(`list.id`, '==', listId)
			.where('status', 'in', status)
			.get();
	} else {
		invitationsSnapshot = await FirebaseServer.database
			.collection('invitations')
			.where(`list.${listId}`, '!=', null)
			.get();
	}

	const invitationsDocuments = invitationsSnapshot.docs.map(doc =>
		InvitationSchema.parse(doc.data())
	);

	return invitationsDocuments;
};
