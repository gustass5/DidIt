export const ResponsibleImage: React.FC<{ image?: string }> = ({ image }) => {
	if (image === undefined) {
		return <></>;
	}

	return (
		<img className="h-7 w-7 rounded-full ring-2 ring-gray-900" src={image} alt="" />
	);
};
