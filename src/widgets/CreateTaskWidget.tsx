import { Form } from '@remix-run/react';

export const CreateTaskWidget: React.FC = () => (
	<Form method="post">
		<input name="name" type="text" placeholder="Name" />
		<input name="labels" type="text" placeholder="Label(s)" />
		<button name="action" type="submit" value="create">
			Create
		</button>
	</Form>
);
