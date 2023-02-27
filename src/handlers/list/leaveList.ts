import { z } from 'zod';
import { ListSchema, UserSchema } from '~/schema/Schema';
import { getList } from './getList';

export const leaveList = async (
	formData: FormData,
	user: z.infer<typeof UserSchema>
) => {
	const currentTimestamp = new Date().toISOString();

	const { listData, listSnapshot } = await getList(formData);

	if (!listData.participants[user.id]) {
		throw new Error('You are not part of this list');
	}

	const { [user.id]: _, ...participants } = listData.participants;

	const newListData = ListSchema.parse({
		...listData,
		participants,
		updated_at: currentTimestamp
	});

	await listSnapshot.ref.set(newListData);
};
