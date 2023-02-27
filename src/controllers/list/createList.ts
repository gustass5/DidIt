import { FirebaseServer } from '~/firebase/server/firebase.server';
import { ListSchema, UserType } from '~/schema/Schema';

export const createList = async (formData: FormData, user: UserType) => {
	const name = formData.get('name');

	const currentTimestamp = new Date().toISOString();

	const newList = ListSchema.parse({
		name,
		author_id: user.id,
		deleted: false,
		participants: {
			[user.id]: {
				id: user.id,
				name: user.name,
				email: user.email,
				image: user.image
			}
		},
		created_at: currentTimestamp,
		updated_at: currentTimestamp
	});

	await FirebaseServer.database.collection('lists').add(newList);
};
