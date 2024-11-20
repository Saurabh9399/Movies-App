import * as React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'secondary';
	isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant = 'primary', isLoading, children, ...props }, ref) => {
		return (
			<button
				ref={ref}
				className={cn(
					// Base styles
					'w-full px-4 py-3 rounded-lg',
					'transition-colors duration-200',
					// Text styles from Figma
					'text-body font-bold leading-6 text-center',
					// Variant styles
					variant === 'primary' && 'bg-primary text-white hover:bg-primary/90',
					variant === 'secondary' && 'bg-input text-white hover:bg-input/90',
					// Loading state
					isLoading && 'opacity-50 cursor-not-allowed',
					className
				)}
				disabled={isLoading}
				{...props}
			>
				{isLoading ? 'Loading...' : children}
			</button>
		);
	}
);
Button.displayName = 'Button';

export { Button };
