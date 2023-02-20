import { ActionArgs } from '@remix-run/node';
import { InvitationStatusEnum } from '~/schema/Schema';
import { Session } from '~/sessions';
import { getListId } from '~/helpers/getListId';
import { getInvitations } from '~/handlers/invitation/getInvitations';
import qs from 'qs';

/**
 * API route to get invitations for specific list
 */
export const action = async ({ request }: ActionArgs) => {
	const user = await Session.isUserSessionValid(request);

	if (!user) {
		throw new Error('Not authorized');
	}

	const formData = await request.formData();

	const listId = getListId(formData);

	const stringifiedFormData = qs.stringify(Object.fromEntries(formData.entries()));

	const formDataEntries = qs.parse(stringifiedFormData);

	const status = InvitationStatusEnum.array().parse(formDataEntries['status']);

	const invitations = await getInvitations(listId, status);

	return { invitations };
};
