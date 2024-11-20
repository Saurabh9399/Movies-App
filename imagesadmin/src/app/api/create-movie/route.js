import connectMongo from '../../../lib/mongodb';
import Movie from '../../../models/Movie';
import path from 'path';
import fs from 'fs/promises';
import { writeFile } from 'fs/promises';

// Disable Next.js body parser
export const config = {
	api: {
		bodyParser: true, // Enable body parsing to read request body without Multer
	},
};

// API route for creating a movie
export const POST = async (req) => {
	try {
		await connectMongo();

		const formData = await req.formData();
		const title = formData.get('title');
		const year = formData.get('year');
		const posterFile = formData.get('poster');

		let poster = null;
		if (posterFile) {
			const uploadsDir = path.join(process.cwd(), 'public/uploads');
			try {
				await fs.mkdir(uploadsDir, { recursive: true });
			} catch (error) {
				console.error('Error creating uploads directory:', error);
			}

			const uniqueFilename = `${Date.now()}-${posterFile.name}`;
			const buffer = await posterFile.arrayBuffer();
			const filePath = path.join(uploadsDir, uniqueFilename);

			// Save file to uploads directory
			await writeFile(filePath, Buffer.from(buffer));
			poster = `/uploads/${uniqueFilename}`;
		}

		const newMovie = new Movie({ title, year, poster });
		await newMovie.save();

		return new Response(
			JSON.stringify({
				message: 'Movie created successfully.',
				movie: newMovie,
			}),
			{
				status: 201,
				headers: { 'Content-Type': 'application/json' },
			}
		);
	} catch (error) {
		// Handle errors gracefully
		console.error('Error creating movie:', error);

		return new Response(
			JSON.stringify({
				message: 'Error creating movie.',
				error: error.message,
			}),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			}
		);
	}
};