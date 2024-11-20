import * as React from 'react';
import { cn } from '@/lib/utils';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string;
}

export function Checkbox({ label, className, ...props }: CheckboxProps) {
	return (
		<label className={cn('flex items-center gap-2 cursor-pointer', className)}>
			<input
				type='checkbox'
				className='w-4 h-4 appearance-none rounded border border-gray-300 
          checked:bg-primary checked:border-primary
          bg-checkbox cursor-pointer'
				{...props}
			/>
			{label && (
				<span className='font-montserrat text-body-sm font-regular text-white'>
					{label}
				</span>
			)}
		</label>
	);
}
