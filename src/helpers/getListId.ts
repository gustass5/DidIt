export const getListId = (formData: FormData) => {
	const listId = formData.get('listId');

	if (listId === null) {
		throw new Error('No list id provided');
	}

	if (typeof listId !== 'string') {
		throw new Error('List id is invalid');
	}

	return listId;
};
