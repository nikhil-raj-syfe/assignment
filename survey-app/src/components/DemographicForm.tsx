import React from 'react';
import { FaUser } from 'react-icons/fa';

interface DemographicData {
  name: string;
  age: number | '';
  gender: string;
  location: string;
}

interface DemographicFormProps {
  data: DemographicData;
  errors: {
    name?: string;
    age?: string;
    gender?: string;
    location?: string;
  };
  onChange: (field: keyof DemographicData, value: string | number) => void;
}

export default function DemographicForm({ data, errors, onChange }: DemographicFormProps) {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^[a-zA-Z ]{0,50}$/.test(value)) {
      onChange('name', value);
    }
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = parseInt(value);
    if (value === '' || (numValue >= 1 && numValue <= 100)) {
      onChange('age', value === '' ? '' : numValue);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
        <div className="flex items-center space-x-4 mb-6">
          <div className="bg-purple-900/30 p-3 rounded-full border border-purple-500/20">
            <FaUser className="w-6 h-6 text-purple-400" />
          </div>
          <h2 className="text-2xl font-semibold text-white">Demographic Information</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={data.name}
              onChange={handleNameChange}
              className={`w-full px-4 py-2 bg-gray-700 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 ${
                errors.name ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="Enter your name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-400">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Age <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              value={data.age}
              onChange={handleAgeChange}
              min="1"
              max="100"
              className={`w-full px-4 py-2 bg-gray-700 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 ${
                errors.age ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="Enter your age"
            />
            {errors.age && (
              <p className="mt-1 text-sm text-red-400">{errors.age}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Gender <span className="text-red-400">*</span>
            </label>
            <select
              value={data.gender}
              onChange={(e) => onChange('gender', e.target.value)}
              className={`w-full px-4 py-2 bg-gray-700 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white ${
                errors.gender ? 'border-red-500' : 'border-gray-600'
              }`}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            {errors.gender && (
              <p className="mt-1 text-sm text-red-400">{errors.gender}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Location
            </label>
            <input
              type="text"
              value={data.location}
              onChange={(e) => onChange('location', e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
              placeholder="Enter your location (optional)"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 