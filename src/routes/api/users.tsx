import { ActionArgs, json } from '@remix-run/node';
import { ZodError } from 'zod';
import { ActionError } from '~/errors/ActionError';
import { FirebaseServer } from '~/firebase/server/firebase.server';
import { UserSchema } from '~/schema/Schema';
import { Session } from '~/sessions';

/**
 * API route to get all the users in the application. It gets all the users regardless of the list
 */
export const action = async ({ request }: ActionArgs) => {
	try {
		const user = await Session.isUserSessionValid(request);

		if (!user) {
			return json({ success: false, users: 'Not authorized' });
		}

		const usersSnapshot = await FirebaseServer.database
			.collection('users')
			.where('id', '!=', user.id)
			.get();

		const usersDocuments = usersSnapshot.docs.map(doc =>
			UserSchema.parse(doc.data())
		);

		return json({ success: true, users: usersDocuments });
	} catch (error: unknown) {
		if (error instanceof ZodError) {
			return json({ success: false, users: 'Invalid input' });
		}

		if (error instanceof ActionError) {
			return json({ success: false, users: error.message });
		}

		return json({ success: false, users: 'Unexpected error ocurred' });
	}
};
