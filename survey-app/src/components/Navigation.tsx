'use client';

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSurvey } from '../contexts/SurveyContext';

export default function Navigation() {
  const { user, signOut, isAdmin } = useAuth();
  const { hasSubmittedSurvey } = useSurvey();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/signin');
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  return (
    <header className="bg-white shadow-lg">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-32">
          <Link to="/" className="flex items-center space-x-3">
            <span className="text-5xl font-bold text-gray-900">
              Health Survey
            </span>
          </Link>

          <nav className="flex items-center space-x-8">
            {user ? (
              <>
                {!isAdmin && (
                  <Link
                    to="/survey"
                    className={`text-lg font-medium ${
                      hasSubmittedSurvey
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-600 hover:text-gray-900 transition-colors'
                    }`}
                    onClick={(e) => {
                      if (hasSubmittedSurvey) {
                        e.preventDefault();
                      }
                    }}
                  >
                    {hasSubmittedSurvey ? 'Survey Submitted' : 'Take Survey'}
                  </Link>
                )}
                <Link
                  to="/responses"
                  className="text-gray-600 hover:text-gray-900 transition-colors font-medium text-lg"
                >
                  {isAdmin ? 'All Responses' : 'My Responses'}
                </Link>
                <div className="flex items-center space-x-6">
                  <span className="text-gray-700 font-medium text-lg">
                    {isAdmin ? '👑 Admin' : `👤 ${user.username}`}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-lg shadow-md hover:shadow-lg"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-6">
                <Link
                  to="/signin"
                  className="px-6 py-3 text-purple-600 hover:text-purple-700 border-2 border-purple-600 hover:border-purple-700 rounded-lg transition-colors font-medium text-lg shadow-md hover:shadow-lg"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-medium text-lg shadow-md hover:shadow-lg hover:scale-105"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
} 