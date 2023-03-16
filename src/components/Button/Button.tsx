export const Button: React.FC<{
	name?: string;
	onClick?: () => void;
	color?: string;
	value?: string;
	className?: string;
	type?: 'submit' | 'button' | 'reset';
	disabled?: boolean;
	children?: React.ReactNode;
}> = ({
	name = '',
	onClick,
	color = 'gray-400',
	value,
	className = '',
	type = 'submit',
	disabled = false,
	children
}) => (
	<button
		name={name}
		type={type}
		value={value}
		onClick={onClick}
		className={`py-2 px-4 uppercase font-semibold text-${color} border border-${color} rounded ${className}`}
		disabled={disabled}
	>
		{children}
	</button>
);
