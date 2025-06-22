import React from "react";
import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    // Check if there's a previous page in history
    if (window.history.length > 1) {
      navigate(-1); // Go back to previous page
    } else {
      navigate("/"); // Fallback to home page if no history
    }
  };

  return (
    <section className="text-center flex flex-col justify-center items-center h-screen px-4 py-16">
      {/* Icon */}
      <FaExclamationTriangle className="text-6xl text-yellow-400 mb-4 sm:text-8xl" />

      {/* Heading */}
      <h1 className="text-3xl font-bold mb-5 sm:text-6xl">404 Not Found</h1>

      {/* Description */}
      <p className="text-lg mb-5 sm:text-xl">This page does not exist</p>

      {/* Button */}
      <button
        onClick={handleGoBack}
        className="text-white bg-indigo-700 hover:bg-indigo-900 rounded px-3 py-2 mt-4 text-sm sm:text-base"
      >
        Go Back
      </button>
    </section>
  );
};

export default NotFound;
