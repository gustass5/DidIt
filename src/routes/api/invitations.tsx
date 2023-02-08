import { ActionArgs } from '@remix-run/node';
import { FirebaseServer } from '~/firebase/server/firebase.server';
import { InvitationSchema } from '~/schema/Schema';
import { Session } from '~/sessions';
import { getListId } from '~/helpers/getListId';

/**
 * API route to get invitations for specific list
 */
export const action = async ({ request }: ActionArgs) => {
	const user = await Session.isUserSessionValid(request);

	if (!user) {
		throw new Error('Not authorized');
	}

	const formData = await request.formData();

	const listId = getListId(formData);

	const invitationsSnapshot = await FirebaseServer.database
		.collection('invitations')
		.where(`list.${listId}`, '!=', null)
		.get();

	const invitationsDocuments = invitationsSnapshot.docs.map(doc =>
		InvitationSchema.parse(doc.data())
	);

	return { invitations: invitationsDocuments };
};
