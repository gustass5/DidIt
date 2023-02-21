import { ActionArgs } from '@remix-run/node';
import { FirebaseServer } from '~/firebase/server/firebase.server';
import { UserSchema } from '~/schema/Schema';
import { Session } from '~/sessions';

/**
 * API route to get all the users in the application. It gets all the users regardless of the list
 */
export const action = async ({ request }: ActionArgs) => {
	const user = await Session.isUserSessionValid(request);

	if (!user) {
		throw new Error('Not authorized');
	}

	const usersSnapshot = await FirebaseServer.database
		.collection('users')
		.where('id', '!=', user.id)
		.get();

	const usersDocuments = usersSnapshot.docs.map(doc => UserSchema.parse(doc.data()));

	return { users: usersDocuments };
};
