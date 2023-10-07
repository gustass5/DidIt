import { LoaderArgs, redirect } from '@remix-run/node';
import { Session } from '~/sessions';

export const loader = async ({ request }: LoaderArgs) => {
	return redirect('/', {
		headers: {
			'Set-Cookie': await Session.destroySession(
				await Session.getSession(request)
			)
		}
	});
};
