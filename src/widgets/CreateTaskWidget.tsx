import { Form } from '@remix-run/react';

export const CreateTaskWidget: React.FC = () => (
	<Form
		method="post"
		className="flex justify-between p-4 mt-6 rounded text-[#9ba6b2] bg-[#191d2a]"
	>
		<div className="flex space-x-3">
			<input
				name="name"
				type="text"
				placeholder="Name"
				className="bg-transparent outline-none"
			/>
			<input
				name="labels"
				type="text"
				placeholder="Label(s)"
				className="bg-transparent outline-none"
			/>
		</div>

		<button
			name="action"
			type="submit"
			value="create"
			className="font-semibold text-orange-400 border py-2 px-4 rounded w-32 border-orange-400"
		>
			CREATE
		</button>
	</Form>
);
