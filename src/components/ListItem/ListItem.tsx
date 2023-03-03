import { Link } from 'react-router-dom';
import { ListType } from '~/schema/Schema';

export const ListItem: React.FC<{ list: ListType; children?: React.ReactNode }> = ({
	list,
	children
}) => (
	<li className="p-1 rounded text-gray-300 font-medium text-[#9ba6b2] hover:bg-[#15181f]">
		<span>
			<Link to={`${list.id}`}>{list.name}</Link>
		</span>
		{children}
	</li>
);
