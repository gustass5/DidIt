import { ActionError } from '~/errors/ActionError';

export const getListId = (formData: FormData) => {
	const listId = formData.get('listId');

	if (listId === null) {
		throw new ActionError('No list id provided');
	}

	if (typeof listId !== 'string') {
		throw new ActionError('List id is invalid');
	}

	return listId;
};
