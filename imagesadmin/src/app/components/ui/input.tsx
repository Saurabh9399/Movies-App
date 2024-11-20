import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, error, ...props }, ref) => {
		return (
			<div className='relative'>
				<input
					type={type}
					className={cn(
						'w-full px-4 py-3 bg-input text-white rounded-lg',
						'placeholder:text-white placeholder:text-body-sm',
						'focus:outline-none focus:ring-2 focus:ring-primary',
						'disabled:opacity-50 disabled:cursor-not-allowed',
						error && 'ring-2 ring-error',
						className
					)}
					ref={ref}
					{...props}
				/>
				{error && <p className='mt-1 text-error text-body-sm'>{error}</p>}
			</div>
		);
	}
);
Input.displayName = 'Input';

export { Input };
