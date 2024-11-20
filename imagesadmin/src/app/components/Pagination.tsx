'use client';

import { Button } from './ui/button';

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

export const Pagination = ({
	currentPage,
	totalPages,
	onPageChange,
}: PaginationProps) => {
	const handlePageChange = (pageNum: number) => {
		if (pageNum >= 1 && pageNum <= totalPages) {
			onPageChange(pageNum); // Call the onPageChange handler passed as prop
		}
	};

	return (
		<div className="flex items-center justify-center gap-2 h-8">
			{/* Previous Button */}
			<Button
				onClick={() => handlePageChange(currentPage - 1)}
				disabled={currentPage === 1}
				className="h-8 border-none font-bold leading-6 text-center flex items-center justify-center gap-4 bg-transparent hover:bg-[#224957] text-white border border-[#224957] disabled:opacity-50 disabled:cursor-not-allowed w-16"
			>
				Prev
			</Button>

			{/* Page Numbers */}
			{Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
				<Button
					key={pageNum}
					onClick={() => handlePageChange(pageNum)}
					className={`h-8 w-8 flex items-center text-white rounded justify-center ${
						currentPage === pageNum
							? 'bg-primary '
							: 'bg-card hover:bg-primary/20'
					}`}
				>
					{pageNum}
				</Button>
			))}

			{/* Next Button */}
			<Button
				onClick={() => handlePageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
				className="h-8 border-none w-16 flex items-center justify-center text-center bg-transparent hover:bg-[#224957] text-white border border-[#224957] disabled:opacity-50 disabled:cursor-not-allowed"
			>
				Next
			</Button>
		</div>
	);
};
