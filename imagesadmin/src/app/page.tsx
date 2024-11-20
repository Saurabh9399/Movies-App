'use client';

import { useRouter } from 'next/navigation';
import { MovieCard } from './components/MovieCard';
import { Pagination } from './components/Pagination';
import { Button } from './components/ui/button';
import { useEffect, useState } from 'react';
import withAuth from './components/withAuth';
import { toast } from 'react-toastify';
import { ShimmerCard } from './components/ui/ShimmerCard';

 function Home() {
  const router = useRouter();
  const [movies, setMovies] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const handlePageChange = (page: number) => {
    setCurrentPage(page); // Update the current page
    fetchMovies(page); // Fetch movies for the selected page
  };

  const fetchMovies = async (page = 1) => {
    try {
      setIsLoading(true); 
      const res = await fetch(`http://localhost:3000/api/getAllMovies?page=${page}`);
      const data = await res.json();
      setMovies(data.movies); // Update movies based on the fetched data
      setTotalPages(data.totalPages);
      setIsLoading(false); 
    } catch (error) {
      console.log("Error fetching movies:", error);
    }
  };

  useEffect(() => {
    fetchMovies(); // Fetch movies when the component mounts
  }, []);

  const NoMovies = () => (
    <div className='flex flex-col items-center justify-center h-full'>
      <h2 className='font-montserrat text-5xl font-semibold leading-[56px] text-center text-white mb-10'>
        Your movie list is empty
      </h2>
      <Button className='max-w-52 px-7 py-4' onClick={() => router.push("/create-movie")}>Add a new movie</Button>
    </div>
  );

  const handleLogoutClick = () => {
    localStorage.setItem("token", "");
    router.push("/sign-in");
    toast.success('Logged out successfully!!!');
  };

  const handleEditMovie = (id: string) => {
    router.push(`/edit-movie/${id}?page=${currentPage}`);
  };

  return (
    <>
      <div className="px-4 py-6 sm:px-8 sm:py-10 md:px-12 lg:px-24 xl:px-[7.5rem] md:pt-16 pb-16">
        {/* Header Section */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row md:gap-0">
          <div className="flex items-center gap-3">
            <h2 className="font-montserrat text-3xl font-semibold text-center text-white md:text-4xl lg:text-5xl">
              My Movies
            </h2>
            <img
              src="/add.svg"
              className="w-6 h-6 cursor-pointer md:w-7 md:h-7 lg:w-[26px] lg:h-[26px]"
              alt="Add Movie"
              onClick={() => router.push("/create-movie")}
            />
          </div>
          <button
            className="font-montserrat text-sm font-bold flex items-center gap-3 text-white md:text-base"
            onClick={handleLogoutClick}
          >
            Logout
            <img src="/logout.svg" className="w-5 h-5 md:w-6 md:h-6 lg:w-[24px] lg:h-[24px]" alt="Logout" />
          </button>
        </div>

        {/* Movies Section */}
        {isLoading ? (
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-6">
            {/* Show shimmer effect while loading */}
            {Array.from({ length: 10 }).map((_, index) => (
              <ShimmerCard key={index} />
            ))}
          </div>
        ) : movies.length === 0 ? (
          <div className="mt-12">
            <NoMovies />
          </div>
        ) : (
          <div className="flex flex-col gap-8 mt-12">
            {/* Movie Cards */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-6">
              {movies.map((movie) => (
                <MovieCard movie={movie} key={movie._id} handleEditMovie={handleEditMovie} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange} // Pass the handler to the Pagination component
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}


export default withAuth(Home); 