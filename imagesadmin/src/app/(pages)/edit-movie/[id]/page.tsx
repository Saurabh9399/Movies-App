"use client";

import withAuth from "@/app/components/withAuth";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const EditMovie = () => {
  const { id, page } = useParams();
  
  const [movieData, setMovieData] = useState({ title: "", year: "", poster: "" });
  const [poster, setPoster] = useState(null); // Stores the uploaded poster file
  const [errors, setErrors] = useState({ title: "", year: "" });
  const router = useRouter();

  // Fetch movie data by ID
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/getAllMovies");
        if (!response.ok) throw new Error("Failed to fetch movies");

        const data = await response.json();
        const movie = data.movies.find((m) => m._id === id);

        if (movie) {
          setMovieData(movie);
        } else {
          console.error("Movie not found");
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    if (id) fetchMovies();
  }, [id]);

  // Form validation
  const validateForm = () => {
    let isValid = true;
    let newErrors = { title: "", year: "" };

    // Validate title
    if (!movieData.title.trim()) {
      newErrors.title = "Title is required";
      isValid = false;
    }

    // Validate year (must be a valid number and within a reasonable range)
    if (!movieData.year.trim()) {
      newErrors.year = "Publishing year is required";
      isValid = false;
    } else if (isNaN(Number(movieData.year)) || Number(movieData.year) < 1900 || Number(movieData.year) > new Date().getFullYear()) {
      newErrors.year = "Please enter a valid year between 1900 and the current year";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Stop form submission if validation fails
    }

    try {
      const formData = new FormData();
      formData.append("title", movieData.title);
      formData.append("year", movieData.year);
      if (poster) formData.append("poster", poster);

      const response = await fetch(`/api/edit-movie/${id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Movie updated successfully");
        router.push("/");
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to update movie");
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPoster(file); // Store the file
    }
  };

  console.log("page",page);
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      {/* Header */}
      <div className="text-white mb-6">
        <h2 className="text-3xl font-semibold">Edit Movie</h2>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="flex gap-10 p-8 rounded-lg shadow-lg">
        {/* Image Upload Section */}
        <div className="w-64 h-64 border-dashed border-2 border-gray-400 flex items-center justify-center text-gray-400 text-sm relative">
          <label
            htmlFor="file-upload"
            className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer"
          >
            {poster ? (
              <img
                src={URL.createObjectURL(poster)} // Preview the uploaded image
                alt="Uploaded Poster"
                className="object-cover w-full h-full"
              />
            ) : movieData.poster ? (
              <img
                src={movieData.poster} // Display existing poster if no new file is uploaded
                alt="Existing Poster"
                className="object-cover w-full h-full"
              />
            ) : (
              <span>Drop an image here</span>
            )}
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>

        {/* Input Fields Section */}
        <div className="flex flex-col gap-4">
          {/* Title Input */}
          <div className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Title"
              className="w-80 px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={movieData.title}
              onChange={(e) => setMovieData({ ...movieData, title: e.target.value })}
            />
            {errors.title && <span className="text-red-500 text-sm">{errors.title}</span>}
          </div>

          {/* Year Input */}
          <div className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Publishing year"
              className="w-80 px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={movieData.year}
              onChange={(e) => setMovieData({ ...movieData, year: e.target.value })}
            />
            {errors.year && <span className="text-red-500 text-sm">{errors.year}</span>}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-4">
            <button
              type="button"
              className="px-6 py-2 bg-transparent border border-gray-400 text-gray-400 rounded-md hover:bg-gray-600 hover:text-white transition duration-200"
              onClick={() => router.push("/")} // Navigate back
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
            >
              Update
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default withAuth(EditMovie);
