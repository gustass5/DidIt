import { Form } from '@remix-run/react';
import { Button } from '~/components/Button/Button';

export const CreateTaskWidget: React.FC<{ children?: React.ReactNode }> = ({
	children
}) => (
	<div className="flex space-x-2 p-4 my-4 rounded text-gray-400 bg-gray-900 border border-orange-400">
		<Form
			method="post"
			className="flex flex-col xl:flex-row flex-1 justify-between"
		>
			<div className="flex flex-col xl:flex-row space-y-3 xl:space-y-0 xl:space-x-3">
				<input
					name="name"
					type="text"
					placeholder="Task name"
					className="bg-transparent outline-none w-full py-4 xl:py-2"
				/>
				<input
					name="labels"
					type="text"
					placeholder="Label(s)"
					className="bg-transparent outline-none w-full py-4 xl:py-2"
				/>
			</div>

			<div className="flex space-x-2">
				<Button
					name="action"
					value="create"
					className="w-full xl:w-32 text-orange-400 border-orange-400"
				>
					CREATE
				</Button>
				{children}
			</div>
		</Form>
	</div>
);
