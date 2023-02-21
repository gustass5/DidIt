import { ActionArgs } from '@remix-run/node';
import { InvitationStatusEnum, UserSchema } from '~/schema/Schema';
import { Session } from '~/sessions';
import { getInvitations } from '~/handlers/invitation/getInvitations';
import qs from 'qs';
import { z } from 'zod';

/**
 * API route to get invitations for specific user
 */
export const action = async ({ request }: ActionArgs) => {
	const user = await Session.isUserSessionValid(request);

	if (!user) {
		throw new Error('Not authorized');
	}

	const formData = await request.formData();

	const data = z.string().parse(formData.get('data'));

	const parsedData = z
		.object({
			user: UserSchema,
			status: InvitationStatusEnum.array()
		})
		.parse(qs.parse(data));

	if (user.id !== parsedData.user.id) {
		throw new Error('You can only see invitations directed to you');
	}

	const invitations = await getInvitations({
		userId: user.id,
		status: parsedData.status
	});

	return { invitations };
};
