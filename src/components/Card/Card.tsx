export const Card: React.FC<{
	title: string;
	data: string | number;
	icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
	backgroundColorClass?: string;
	textColorClass?: string;
	borderColorClass?: string;
}> = ({
	title,
	data,
	icon,
	backgroundColorClass = '',
	textColorClass = '',
	borderColorClass = ''
}) => {
	const Icon = icon;
	return (
		<div
			className={`flex items-center h-36 rounded bg-gray-900 w-full border ${borderColorClass}`}
		>
			<div
				className={`items-center justify-center h-full w-1/3 ${backgroundColorClass} rounded-l hidden xl:flex`}
			>
				<Icon className="w-1/2 text-gray-900" />
			</div>

			<div className={`flex flex-col flex-1 space-y-3 ${textColorClass}`}>
				<span className="text-6xl font-semibold text-center">{data}</span>

				<span className="font-semibold text-center px-4 uppercase">
					{title}
				</span>
			</div>
		</div>
	);
};
