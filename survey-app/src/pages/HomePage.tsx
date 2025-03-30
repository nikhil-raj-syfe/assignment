import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Welcome to Survey App</h1>
      <div className="space-y-4">
        {user ? (
          <>
            <Link
              to="/survey"
              className="block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
            >
              Take Survey
            </Link>
            <Link
              to="/responses"
              className="block bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
            >
              View Responses
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/signin"
              className="block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="block bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  );
} 