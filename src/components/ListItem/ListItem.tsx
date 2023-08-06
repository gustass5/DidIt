import { Link } from 'react-router-dom';
import { ListType } from '~/schema/Schema';

export const ListItem: React.FC<{ list: ListType; children?: React.ReactNode }> = ({
	list,
	children
}) => (
	<li className="flex items-center justify-between rounded font-medium text-gray-300">
		<span className="flex flex-1">
			<a className="flex flex-1 py-2" href={`/lists/${list.id}`}>
				{list.name}
			</a>
		</span>
		{children}
	</li>
);
