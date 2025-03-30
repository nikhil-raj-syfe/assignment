import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaUser, FaHeartbeat, FaWallet, FaCalendar, FaMapMarkerAlt, FaVenusMars } from 'react-icons/fa';
import { api } from '../utils/api';

type SurveyResponse = {
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
};

export default function ResponseDetails() {
  const { id } = useParams<{ id: string }>();
  const [response, setResponse] = useState<SurveyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResponse = async () => {
      try {
        const data = await api.getSurveyResponse(id as string);
        setResponse(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchResponse();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-200">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gray-800/50 border-l-4 border-gray-500 p-4 rounded-r-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-300">Response not found</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex justify-between items-center mb-12">
          <Link 
            to="/responses"
            className="inline-flex items-center text-purple-400 hover:text-purple-300 font-medium transition-colors"
          >
            <FaArrowLeft className="w-5 h-5 mr-2" />
            Back to Responses
          </Link>
        </div>

        <div className="bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-800">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Survey Response Details</h1>
              <p className="text-gray-400">View detailed information about this survey submission</p>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <FaCalendar className="w-5 h-5 text-purple-400" />
              <span className="text-sm">{new Date(response.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="space-y-8">
            {/* Demographic Section */}
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-purple-900/30 p-3 rounded-full border border-purple-500/20">
                  <FaUser className="w-6 h-6 text-purple-400" />
                </div>
                <h2 className="text-2xl font-semibold text-white">Demographic Information</h2>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">{response.demographic.name}</h3>
                  <p className="text-gray-400">{response.demographic.age} years old</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-gray-300">
                    <FaVenusMars className="w-5 h-5 text-purple-400" />
                    <span>{response.demographic.gender}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-300">
                    <FaMapMarkerAlt className="w-5 h-5 text-purple-400" />
                    <span>{response.demographic.location}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Health Section */}
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-purple-900/30 p-3 rounded-full border border-purple-500/20">
                  <FaHeartbeat className="w-6 h-6 text-purple-400" />
                </div>
                <h2 className="text-2xl font-semibold text-white">Health Information</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Current Conditions</h3>
                  <div className="flex flex-wrap gap-2">
                    {response.health.currentConditions.map((condition, index) => (
                      <span key={index} className="px-3 py-1 bg-purple-900/30 text-purple-300 rounded-full text-sm border border-purple-500/20">
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Medications</h3>
                  <div className="flex flex-wrap gap-2">
                    {response.health.medications.map((medication, index) => (
                      <span key={index} className="px-3 py-1 bg-purple-900/30 text-purple-300 rounded-full text-sm border border-purple-500/20">
                        {medication}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Lifestyle</h3>
                  <div className="space-y-4">
                    <div>
                      <span className="text-gray-300">Exercise Routine:</span>
                      <p className="text-gray-400 mt-1">{response.health.lifestyle.exercise}</p>
                    </div>
                    <div>
                      <span className="text-gray-300">Diet:</span>
                      <p className="text-gray-400 mt-1">{response.health.lifestyle.diet}</p>
                    </div>
                    <div>
                      <span className="text-gray-300">Smoking Status:</span>
                      <p className="text-gray-400 mt-1">{response.health.lifestyle.smoking ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Section */}
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-purple-900/30 p-3 rounded-full border border-purple-500/20">
                  <FaWallet className="w-6 h-6 text-purple-400" />
                </div>
                <h2 className="text-2xl font-semibold text-white">Financial Information</h2>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Annual Income</h3>
                  <p className="text-gray-400">${response.financial.income.toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Savings</h3>
                  <p className="text-gray-400">${response.financial.savings.toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Health Insurance</h3>
                  <p className="text-gray-400">{response.financial.insurance ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 