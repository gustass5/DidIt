import { ActionArgs, json } from '@remix-run/node';
import { InvitationStatusEnum, UserSchema } from '~/schema/Schema';
import { Session } from '~/sessions';
import { getInvitations } from '~/controllers/invitation/getInvitations';
import qs from 'qs';
import { ZodError, z } from 'zod';
import { ActionError } from '~/errors/ActionError';

/**
 * API route to get invitations for specific user
 */
export const action = async ({ request }: ActionArgs) => {
	try {
		const user = await Session.isUserSessionValid(request);

		if (!user) {
			return json({ success: false, error: 'Not authorized' });
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
			return json({
				success: false,
				error: 'You can only see invitations directed to you'
			});
		}

		const invitations = await getInvitations({
			userId: user.id,
			status: parsedData.status
		});

		return json({ success: true, invitations });
	} catch (error: unknown) {
		if (error instanceof ZodError) {
			return json({ success: false, error: 'Invalid input' });
		}

		if (error instanceof ActionError) {
			return json({ success: false, error: error.message });
		}

		return json({ success: false, error: 'Unexpected error ocurred' });
	}
};
