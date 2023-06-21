export interface ButtonInterface {
	name?: string;
	onClick?: () => void;
	value?: string;
	className?: string;
	type?: 'submit' | 'button' | 'reset';
	disabled?: boolean;
	children?: React.ReactNode;
}

export const Button: React.FC<ButtonInterface> = ({
	name = '',
	onClick,
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
		className={`py-2 uppercase font-semibold border rounded ${className}`}
		disabled={disabled}
	>
		{children}
	</button>
);
