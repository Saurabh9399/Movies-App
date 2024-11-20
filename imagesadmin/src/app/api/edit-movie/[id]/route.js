import connectMongo from '../../../../lib/mongodb';
import Movie from '../../../../models/Movie';
import path from 'path';
import fs from 'fs/promises';
import { writeFile } from 'fs/promises';

// Disable Next.js body parser
export const config = {
  api: {
    bodyParser: true, // Enable body parsing for easier form handling
  },
};

// API route for updating a movie by ID
export const PUT = async (req, { params }) => {
  const { id } = params;  // Get movie ID from URL parameters

  try {
    await connectMongo();

    // Extract form data from the request
    const formData = await req.formData();
    const title = formData.get('title');
    const year = formData.get('year');
    const posterFile = formData.get('poster');

    // Find the movie by ID
    const movie = await Movie.findById(id);
    if (!movie) {
      return new Response(
        JSON.stringify({ message: 'Movie not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Update the movie fields
    if (title) movie.title = title;
    if (year) movie.year = year;

    // Handle the poster upload if provided
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

      // Save the file to the uploads directory
      await writeFile(filePath, Buffer.from(buffer));
      movie.poster = `/uploads/${uniqueFilename}`;
    }

    // Save the updated movie
    await movie.save();

    // Return the updated movie
    return new Response(
      JSON.stringify({ message: 'Movie updated successfully', movie }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    // Handle errors gracefully
    console.error('Error updating movie:', error);
    return new Response(
      JSON.stringify({ message: 'Error updating movie', error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
