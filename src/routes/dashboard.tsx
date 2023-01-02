import { LoaderFunction, redirect } from '@remix-run/node';
import { Session } from '~/sessions';

export const loader: LoaderFunction = async ({ request }) => {
	if (!(await Session.isUserSessionValid(request))) {
		return redirect('/');
	}
	return null;
};

export default function Dashboard() {
	return <div>Whats up</div>;
}
