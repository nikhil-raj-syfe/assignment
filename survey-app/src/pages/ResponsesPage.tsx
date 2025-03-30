import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSurvey } from '../contexts/SurveyContext';
import { api } from '../utils/api';

interface SurveyResponse {
  response_id: string;
  userId: string;
  userEmail: string;
  demographic: {
    name: string;
    age: number;
    gender: string;
    location: string;
  };
  health: {
    currentConditions: string[];
    medications: string[];
    lifestyle: {
      exercise: string;
      diet: string;
      smoking: boolean;
    };
  };
  financial: {
    income: number;
    savings: number;
    insurance: boolean;
  };
  created_at: string;
}

export default function ResponsesPage() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { hasSubmittedSurvey } = useSurvey();
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    const fetchResponses = async () => {
      try {
        const data = await api.getResponses(isAdmin);
        setResponses(data);
      } catch (err) {
        setError('Failed to fetch responses');
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, [user, isAdmin, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-5rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">
          {isAdmin ? 'All Survey Responses' : 'My Survey Responses'}
        </h1>
        {!isAdmin && !hasSubmittedSurvey && (
          <button
            onClick={() => navigate('/survey')}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Take New Survey
          </button>
        )}
      </div>

      {responses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">
            {isAdmin
              ? 'No survey responses yet.'
              : 'You haven\'t submitted any surveys yet.'}
          </p>
          {!isAdmin && !hasSubmittedSurvey && (
            <button
              onClick={() => navigate('/survey')}
              className="mt-4 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Take Your First Survey
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {responses.map((response) => (
            <div
              key={response.response_id}
              className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {response.demographic.name}
                    </h3>
                    {isAdmin && (
                      <p className="text-sm text-gray-400">{response.userEmail}</p>
                    )}
                  </div>
                  <span className="text-sm text-gray-400">
                    {new Date(response.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Age:</span>
                    <span className="text-white">{response.demographic.age}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Gender:</span>
                    <span className="text-white">{response.demographic.gender}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    console.log('Response ID:', response.response_id);
                    navigate(`/responses/${response.response_id}`);
                  }}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors mt-4"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 