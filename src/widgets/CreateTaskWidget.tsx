import { Form } from '@remix-run/react';
import { Button } from '~/components/Button/Button';

export const CreateTaskWidget: React.FC = () => (
	<Form
		method="post"
		className="flex justify-between p-4 mt-6 rounded text-[#9ba6b2] bg-[#191d2a]"
	>
		<div className="flex space-x-3">
			<input
				name="name"
				type="text"
				placeholder="Task name"
				className="bg-transparent outline-none"
			/>
			<input
				name="labels"
				type="text"
				placeholder="Label(s)"
				className="bg-transparent outline-none"
			/>
		</div>

		<Button name="action" value="create" color="orange-400" className="w-32">
			CREATE
		</Button>
	</Form>
);
