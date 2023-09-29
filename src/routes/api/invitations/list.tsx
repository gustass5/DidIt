import { ActionArgs, json } from '@remix-run/node';
import { InvitationStatusEnum } from '~/schema/Schema';
import { Session } from '~/sessions';
import { getInvitations } from '~/controllers/invitation/getInvitations';
import { getListId } from '~/helpers/getListId';
import qs from 'qs';
import { ActionError } from '~/errors/ActionError';
import { ZodError } from 'zod';

/**
 * API route to get invitations for specific list
 */
export const action = async ({ request }: ActionArgs) => {
	try {
		const user = await Session.isUserSessionValid(request);

		if (!user) {
			return json({ success: false, error: 'Not authorized' });
		}

		const formData = await request.formData();

		const listId = getListId(formData);

		const stringifiedFormData = qs.stringify(
			Object.fromEntries(formData.entries())
		);

		const formDataEntries = qs.parse(stringifiedFormData);

		const status = InvitationStatusEnum.array().parse(formDataEntries['status']);

		const invitations = await getInvitations({ listId, status });

		return json({ success: true, invitations });
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
