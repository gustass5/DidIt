import { ListType } from '~/schema/Schema';

export const InfoCard: React.FC<{ list: ListType }> = ({ list }) => (
	<div className="flex items-center h-32 w-96 rounded bg-[#191d2a] p-4 text-[#9ba6b2]">
		<div className="flex flex-col flex-1">
			<div className="pb-4 text-2xl font-semibold uppercase text-orange-400">
				{list.name}
			</div>
			<div className="flex justify-between">
				<span className="font-semibold uppercase text-orange-400 text-sm">
					Created by
				</span>
				<span>{list.participants[list.author_id].name}</span>
			</div>
			<div className="flex justify-between">
				<span className="font-semibold uppercase text-orange-400 text-sm">
					Created at
				</span>
				<span>{list.created_at.split('T')[0]}</span>
			</div>
		</div>
	</div>
);
