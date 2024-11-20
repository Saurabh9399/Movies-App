"use client"
import React, { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { useRouter } from 'next/navigation';
import withAuth from '@/app/components/withAuth';
import { toast } from 'react-toastify';

const CreateNewMovie = () => {
  const [title, setTitle] = useState('');
  const [publishYear, setPublishYear] = useState('');
  const [poster, setPoster] = useState<File | null>(null); // To hold the uploaded file
  const [posterName, setPosterName] = useState<string>(''); // To hold the name of the uploaded file

  const [errors, setErrors] = useState<{ title?: string; publishYear?: string; poster?: string }>({});

  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setPoster(file);
      setPosterName(file.name); // Set the file name to display
    }
  };

  const validateForm = () => {
    const newErrors: { title?: string; publishYear?: string; poster?: string } = {};

    if (!title) {
      newErrors.title = 'Title is required';
    }

    if (!publishYear || isNaN(Number(publishYear)) || Number(publishYear) <= 0) {
      newErrors.publishYear = 'Please enter a valid publishing year';
    }

    if (!poster) {
      newErrors.poster = 'Please upload a movie poster';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // If validation fails, do not proceed with the form submission
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('year', publishYear);
    if (poster) {
      formData.append('poster', poster); // Append the file to the form data
      console.log("formData", formData);
    }

    try {
      const response = await fetch('http://localhost:3000/api/create-movie', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Movie creation failed');
      }

      const data = await response.json();
      console.log('Movie created successfully:', data);
      
      setPoster(null);
      setTitle("");
      setPublishYear("");
      router.push("/");
      toast.success('Movie created successfully:');
      // Optionally, clear the form or redirect
    } catch (error) {
      toast.error('Oops! Error while creating movie');
      console.log('Error during movie creation:', error?.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[52rem]">
      {/* Header */}
      <div className="text-white mb-6">
        <h2 className="text-3xl font-semibold">Create a new movie</h2>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="flex gap-10 p-8 rounded-lg shadow-lg">
        {/* Image Upload Section */}
        <div
          className="w-64 h-64 border-dashed border-2 border-gray-400 flex items-center justify-center text-gray-400 text-sm cursor-pointer relative"
        >
          <label
            htmlFor="file-upload"
            className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer"
          >
            {/* Display the file name if selected */}
            {posterName ? (
              <span className="text-gray-500 text-sm">{posterName}</span>
            ) : (
              <span>Drop an image here</span>
            )}
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange} // Handle file change
            />
          </label>
        </div>

        {/* Input Fields Section */}
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-80 px-4 py-2 rounded-md bg-[#1b4a63] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {errors.title && (
            <span className="text-red-500 text-sm">{errors.title}</span>
          )}

          <input
            type="text"
            placeholder="Publishing year"
            value={publishYear}
            onChange={(e) => setPublishYear(e.target.value)}
            className="w-80 px-4 py-2 rounded-md bg-[#1b4a63] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {errors.publishYear && (
            <span className="text-red-500 text-sm">{errors.publishYear}</span>
          )}

          {/* Buttons */}
          <div className="flex gap-4 mt-4">
            <button className="px-6 py-2 bg-transparent border border-gray-400 text-gray-400 rounded-md hover:bg-gray-600 hover:text-white transition duration-200" onClick={() => router.push("/")} >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default withAuth(CreateNewMovie);
