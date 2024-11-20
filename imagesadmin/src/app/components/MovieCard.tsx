import Image from 'next/image';

interface MovieCardProps {
	movie: {
		poster: string;
		title: string;
		year: number;
		_id: string
	},
	handleEditMovie:(id:string)=>void
}

export const MovieCard = ({ movie, handleEditMovie }: MovieCardProps) => {
	const { poster, title, year, _id } = movie;
	

	return (
		<div className='w-[282px] h-[504px] p-2 pb-0 bg-card rounded-xl cursor-pointer' onClick={() => handleEditMovie(_id)}>
			<Image
				src={poster}
				alt={title}
				width={266}
				height={400}
				className='rounded-xl mb-4'
			/>
			<div className='flex flex-col gap-2 ml-2'>
				<h3 className='font-montserrat text-[20px] font-medium leading-[32px] text-left'>
					{title}
				</h3>
				<p className='text-body font-montserrat font-normal  leading-[24px]'>
					{year}
				</p>
			</div>
		</div>
	);
};
