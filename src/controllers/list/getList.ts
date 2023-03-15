import { FirebaseServer } from '~/firebase/server/firebase.server';
import { getListId } from '~/helpers/getListId';
import { ListSchema, UserType } from '~/schema/Schema';

export const getList = async (
	formData: FormData,
	user: UserType,
	shouldBeAuthorized: boolean = true
) => {
	const listId = getListId(formData);
	// Get task snapshot so changes can be made to it
	const listSnapshot = await FirebaseServer.database
		.collection('lists')
		.doc(listId)
		.get();

	if (!listSnapshot.exists) {
		throw new Error('List does not exist');
	}

	const listData = ListSchema.parse({ id: listSnapshot.id, ...listSnapshot.data() });

	if (listData.deleted) {
		throw new Error('List is not accessible');
	}

	if (!(user.id in listData.participants) && shouldBeAuthorized) {
		throw new Error('List is not accessible');
	}

	return { listData, listSnapshot };
};
