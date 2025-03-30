import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';
import { FaArrowLeft } from 'react-icons/fa';

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

export default function ResponseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [response, setResponse] = useState<SurveyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    const fetchResponse = async () => {
      try {
        const data = await api.getSurveyResponse(id!);
        setResponse(data);
      } catch (err) {
        setError('Failed to fetch survey response');
      } finally {
        setLoading(false);
      }
    };

    fetchResponse();
  }, [id, user, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-5rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error || !response) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
          {error || 'Survey response not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <Link 
          to="/responses"
          className="inline-flex items-center text-purple-400 hover:text-purple-300 font-medium transition-colors"
        >
          <FaArrowLeft className="w-5 h-5 mr-2" />
          Back to Responses
        </Link>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-700">
            <div>
              <h3 className="text-xl font-semibold text-white mb-1">
                {response.demographic.name}
              </h3>
              {isAdmin && (
                <p className="text-sm text-gray-400">{response.userEmail}</p>
              )}
            </div>
            <span className="text-sm text-gray-400">
              Submitted on {new Date(response.created_at).toLocaleDateString()}
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 rounded-lg p-6">
              <h4 className="text-base font-medium text-purple-400 mb-4 pb-2 border-b border-gray-700">
                Demographic Information
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Age:</span>
                  <span className="text-white">{response.demographic.age}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Gender:</span>
                  <span className="text-white">{response.demographic.gender}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Location:</span>
                  <span className="text-white">{response.demographic.location}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-6">
              <h4 className="text-base font-medium text-purple-400 mb-4 pb-2 border-b border-gray-700">
                Health Information
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Exercise:</span>
                  <span className="text-white">{response.health.lifestyle.exercise}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Diet:</span>
                  <span className="text-white">{response.health.lifestyle.diet}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Smoking:</span>
                  <span className="text-white">
                    {response.health.lifestyle.smoking ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="mt-4">
                  <div className="text-gray-400 mb-2">Current Conditions:</div>
                  <div className="text-white">
                    {response.health.currentConditions.length > 0 
                      ? response.health.currentConditions.join(', ')
                      : 'None reported'}
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-gray-400 mb-2">Medications:</div>
                  <div className="text-white">
                    {response.health.medications.length > 0 
                      ? response.health.medications.join(', ')
                      : 'None reported'}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-6">
              <h4 className="text-base font-medium text-purple-400 mb-4 pb-2 border-b border-gray-700">
                Financial Information
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Income:</span>
                  <span className="text-white">
                    ${response.financial.income.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Savings:</span>
                  <span className="text-white">
                    ${response.financial.savings.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Insurance:</span>
                  <span className="text-white">
                    {response.financial.insurance ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 