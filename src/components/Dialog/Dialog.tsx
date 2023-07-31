import { ButtonInterface } from '../Button/Button';
import { Dialog as HeadlessDialog } from '@headlessui/react';
import React, { useState } from 'react';

export const Dialog: React.FC<{
	title: string;
	description: string;
	button: React.ReactElement<ButtonInterface>;
	children?: React.ReactNode;
}> = ({ title, description, button, children }) => {
	const [isOpen, setIsOpen] = useState(false);
	const ButtonComponent = button;
	return (
		<>
			<ButtonComponent.type
				{...ButtonComponent.props}
				onClick={() => setIsOpen(true)}
			/>
			<HeadlessDialog
				open={isOpen}
				onClose={() => setIsOpen(false)}
				className="relative z-50"
			>
				<div className="fixed inset-0 bg-black/30" aria-hidden="true" />
				<div className="fixed inset-0 flex items-center justify-center p-4">
					<HeadlessDialog.Panel className="w-full xl:max-w-xl rounded bg-gray-900 border-2 border-gray-600">
						<div className="bg-[#111319] rounded p-6 space-y-2">
							<HeadlessDialog.Title className="text-xl font-semibold text-orange-400 uppercase shadow">
								{title}
							</HeadlessDialog.Title>
							<HeadlessDialog.Description className="text-md  text-gray-400">
								{description}
							</HeadlessDialog.Description>
						</div>
						<div className="p-6">{children}</div>
					</HeadlessDialog.Panel>
				</div>
			</HeadlessDialog>
		</>
	);
};
