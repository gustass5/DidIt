import { z } from 'zod';
import { FirebaseServer } from '~/firebase/server/firebase.server';
import { getListId } from '~/helpers/getListId';
import { InvitationSchema, UserSchema } from '~/schema/Schema';

const getKey = (index: number, key: string) => `invitees[${index}][${key}]`;

export const inviteUsers = async (
	formData: FormData,
	user: z.infer<typeof UserSchema>
) => {
	const listId = getListId(formData);

	let i = 0;

	let errors = [];

	while (formData.get(getKey(i, 'id')) !== null) {
		/**
		 * Safe parsing because if some users somehow fail, the rest are still invited
		 */
		const parsedInviteeData = UserSchema.safeParse({
			id: formData.get(getKey(i, 'id')),
			name: formData.get(getKey(i, 'name')),
			email: formData.get(getKey(i, 'email')),
			image: formData.get(getKey(i, 'image'))
		});

		if (!parsedInviteeData.success) {
			errors.push(parsedInviteeData.error);
			continue;
		}

		const currentTimestamp = new Date().toISOString();

		const listName = formData.get('listName');

		const newInvitation = InvitationSchema.parse({
			list: { [listId]: listName },
			inviter: user,
			invited: parsedInviteeData.data,
			created_at: currentTimestamp,
			updated_at: currentTimestamp
		});

		FirebaseServer.database.collection('invitations').add(newInvitation);

		i++;
	}

	if (errors.length > 0) {
		throw new Error(
			`Unexpected errors occurred during invitation: ${errors
				.map(error => JSON.stringify(error))
				.join(',')}`
		);
	}
};
