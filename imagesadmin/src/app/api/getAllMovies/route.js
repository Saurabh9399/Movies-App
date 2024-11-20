import connectMongo from '../../../lib/mongodb';
import Movie from '../../../models/Movie';

// API route for fetching all movies with pagination
export const GET = async (req) => {
  try {
    // Connect to MongoDB
    await connectMongo();

    // Get the page and limit from the query parameters (default to page 1 and limit 10)
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;

    // Calculate the skip value for pagination
    const skip = (page - 1) * limit;

    // Fetch the movies with pagination
    const movies = await Movie.find().skip(skip).limit(limit);

    // Get the total count of movies for pagination
    const totalMovies = await Movie.countDocuments();

    // Calculate total pages
    const totalPages = Math.ceil(totalMovies / limit);

    // Respond with the paginated movies and total pages
    return new Response(
      JSON.stringify({
        message: 'Movies fetched successfully.',
        movies,
        totalPages, // Add totalPages to the response
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    // Handle errors gracefully
    console.error('Error fetching movies:', error);

    return new Response(
      JSON.stringify({
        message: 'Error fetching movies.',
        error: error.message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
