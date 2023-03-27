import { Form } from '@remix-run/react';
import { Button } from '~/components/Button/Button';

export const CreateTaskWidget: React.FC<{ children?: React.ReactNode }> = ({
	children
}) => (
	<div className="flex space-x-2 p-4 my-6 rounded text-[#9ba6b2] bg-[#191d2a]">
		<Form method="post" className="flex flex-1 justify-between">
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

			<div className="flex space-x-2">
				<Button
					name="action"
					value="create"
					className="w-32 text-orange-400 border-orange-400"
				>
					CREATE
				</Button>
			</div>
		</Form>
		{children}
	</div>
);
