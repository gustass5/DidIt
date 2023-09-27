import { ListType } from '~/schema/Schema';

export const InfoCard: React.FC<{ list: ListType }> = ({ list }) => (
	<div className="flex items-center h-36 w-full xl:w-96 rounded bg-gray-900 p-4 text-gray-400 border border-orange-400">
		<div className="flex flex-col flex-1">
			<div className="pb-4 text-2xl xl:text-lg 2xl:text-2xl font-semibold uppercase text-orange-400">
				{list.name}
			</div>
			<div className="flex justify-between">
				<span className="font-semibold uppercase text-orange-400 text-sm xl:text-xs 2xl:text-sm">
					Created by
				</span>
				<span className="text-sm xl:text-xs 2xl:text-sm">
					{list.participants[list.author_id].name}
				</span>
			</div>
			<div className="flex justify-between">
				<span className="font-semibold uppercase text-orange-400 text-sm xl:text-xs 2xl:text-sm">
					Created at
				</span>
				<span className="text-sm xl:text-xs 2xl:text-sm">
					{list.created_at.split('T')[0]}
				</span>
			</div>
		</div>
	</div>
);
