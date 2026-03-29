import React from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiGrid } from "react-icons/fi";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-lg w-full px-6 py-12 text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-200 mb-4">404</h1>
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
          >
            <FiArrowLeft size={20} />
            Go Back
          </button>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
          >
            <FiGrid size={20} />
            Go To Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
