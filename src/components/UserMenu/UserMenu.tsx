import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { UserType } from '~/schema/Schema';

function classNames(...classes: any[]) {
	return classes.filter(Boolean).join(' ');
}
export const UserMenu: React.FC<{ user: UserType }> = ({ user }) => (
	<Menu as="div" className="relative ml-3 ">
		<div>
			<Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
				<span className="sr-only">Open user menu</span>
				<img className="h-12 w-12 rounded-full" src={user.image} alt="" />
			</Menu.Button>
		</div>
		<Transition
			as={Fragment}
			enter="transition ease-out duration-100"
			enterFrom="transform opacity-0 scale-95"
			enterTo="transform opacity-100 scale-100"
			leave="transition ease-in duration-75"
			leaveFrom="transform opacity-100 scale-100"
			leaveTo="transform opacity-0 scale-95"
		>
			<Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-900 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
				<Menu.Item>
					{({ active }) => (
						<a
							href="#"
							className={classNames(
								active ? 'bg-gray-100' : '',
								'block px-4 py-2 text-sm text-gray-400'
							)}
						>
							Your Profile
						</a>
					)}
				</Menu.Item>
				<Menu.Item>
					{({ active }) => (
						<a
							href="#"
							className={classNames(
								active ? 'bg-gray-100' : '',
								'block px-4 py-2 text-sm text-gray-400'
							)}
						>
							Settings
						</a>
					)}
				</Menu.Item>
				<Menu.Item>
					{({ active }) => (
						<a
							href="#"
							className={classNames(
								active ? 'bg-gray-100' : '',
								'block px-4 py-2 text-sm text-gray-400'
							)}
						>
							Sign out
						</a>
					)}
				</Menu.Item>
			</Menu.Items>
		</Transition>
	</Menu>
);
