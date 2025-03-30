'use client';

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaUser, FaHeartbeat, FaWallet, FaCheck } from 'react-icons/fa';
import { api } from '../utils/api';
import { useSurvey } from '../contexts/SurveyContext';
import ProgressIndicator from './ProgressIndicator';
import DemographicForm from './DemographicForm';

type FormData = {
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
};

const initialFormData: FormData = {
  demographic: {
    name: '',
    age: 0,
    gender: '',
    location: '',
  },
  health: {
    currentConditions: ['None'],
    medications: ['None'],
    lifestyle: {
      exercise: '',
      diet: '',
      smoking: false,
    },
  },
  financial: {
    income: 0,
    savings: 0,
    insurance: false,
  },
};

const exerciseOptions = [
  'Daily',
  '2 times a week',
  '3 times a week',
  '4 times a week',
  '5 times a week',
  '6 times a week'
];

const dietOptions = [
  'Vegetarian',
  'Non-Vegetarian'
];

const steps = [
  { id: 'demographic', title: 'Demographic Information' },
  { id: 'health', title: 'Health Information' },
  { id: 'financial', title: 'Financial Information' },
];

export default function Survey() {
  const navigate = useNavigate();
  const { setHasSubmittedSurvey } = useSurvey();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    demographic: {
      name?: string;
      age?: string;
      gender?: string;
      location?: string;
    };
    health: {
      currentConditions?: string;
      medications?: string;
      lifestyle: {
        exercise?: string;
        diet?: string;
        smoking?: string;
      };
    };
    financial: {
      income?: string;
      savings?: string;
      insurance?: string;
    };
    submit?: string;
  }>({
    demographic: {},
    health: {
      lifestyle: {}
    },
    financial: {}
  });

  const validateField = (section: keyof FormData, field: string, value: any): string | null => {
    if (section === 'demographic') {
      switch (field) {
        case 'name':
          if (!value.trim()) return 'Name is required';
          if (!/^[a-zA-Z ]{1,50}$/.test(value)) {
            return 'Name should only contain letters and spaces (max 50 characters)';
          }
          return null;
        case 'age':
          if (!value) return 'Age is required';
          const ageNum = parseInt(value);
          if (isNaN(ageNum) || ageNum < 0 || ageNum > 100) {
            return 'Age must be between 0 and 100';
          }
          return null;
        case 'gender':
          if (!value) return 'Gender is required';
          if (!['male', 'female'].includes(value)) {
            return 'Please select a valid gender';
          }
          return null;
        case 'location':
          if (!value.trim()) return 'Location is required';
          if (!/^[a-zA-Z0-9 -/]{1,200}$/.test(value)) {
            return 'Location should only contain letters, numbers, spaces, hyphens, and forward slashes (max 200 characters)';
          }
          return null;
      }
    } else if (section === 'health') {
      switch (field) {
        case 'exercise':
          if (!value) return 'Please select exercise frequency';
          return null;
        case 'diet':
          if (!value) return 'Please select diet type';
          return null;
      }
    } else if (section === 'financial') {
      switch (field) {
        case 'income':
          if (!value && value !== 0) return 'Please enter your annual income';
          if (value < 0) return 'Income cannot be negative';
          return null;
        case 'savings':
          if (!value && value !== 0) return 'Please enter your savings';
          if (value < 0) return 'Savings cannot be negative';
          return null;
      }
    }
    return null;
  };

  const handleInputChange = (section: keyof FormData, field: string, value: any) => {
    const error = validateField(section, field, value);
    setErrors(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: error
      }
    }));

    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleLifestyleChange = (field: string, value: any) => {
    const error = validateField('health', field, value);
    setErrors(prev => ({
      ...prev,
      health: {
        ...prev.health,
        lifestyle: {
          ...prev.health.lifestyle,
          [field]: error
        }
      }
    }));

    setFormData(prev => ({
      ...prev,
      health: {
        ...prev.health,
        lifestyle: {
          ...prev.health.lifestyle,
          [field]: value
        }
      }
    }));
  };

  const handleConditionAdd = (value: string) => {
    if (!value.trim()) return;
    setFormData(prev => ({
      ...prev,
      health: {
        ...prev.health,
        currentConditions: prev.health.currentConditions.includes('None') 
          ? [value.trim()]
          : [...prev.health.currentConditions, value.trim()]
      }
    }));
  };

  const handleConditionRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      health: {
        ...prev.health,
        currentConditions: prev.health.currentConditions.filter((_, i) => i !== index)
      }
    }));
  };

  const handleMedicationAdd = (value: string) => {
    if (!value.trim()) return;
    setFormData(prev => ({
      ...prev,
      health: {
        ...prev.health,
        medications: prev.health.medications.includes('None')
          ? [value.trim()]
          : [...prev.health.medications, value.trim()]
      }
    }));
  };

  const handleMedicationRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      health: {
        ...prev.health,
        medications: prev.health.medications.filter((_, i) => i !== index)
      }
    }));
  };

  const validateStep = () => {
    const newErrors = { ...errors };
    let isValid = true;

    if (currentStep === 0) {
      // Validate demographic information
      const demoFields = ['name', 'age', 'gender'] as const;
      demoFields.forEach(field => {
        const error = validateField('demographic', field, formData.demographic[field]);
        if (error) {
          newErrors.demographic[field] = error;
          isValid = false;
        }
      });
    } else if (currentStep === 1) {
      // Validate health information
      const error = validateField('health', 'exercise', formData.health.lifestyle.exercise);
      if (error) {
        newErrors.health.lifestyle.exercise = error;
        isValid = false;
      }
      const dietError = validateField('health', 'diet', formData.health.lifestyle.diet);
      if (dietError) {
        newErrors.health.lifestyle.diet = dietError;
        isValid = false;
      }
    } else if (currentStep === 2) {
      // Validate financial information
      const financialFields = ['income', 'savings'] as const;
      financialFields.forEach(field => {
        const error = validateField('financial', field, formData.financial[field]);
        if (error) {
          newErrors.financial[field] = error;
          isValid = false;
        }
      });
    }

    setErrors(newErrors);
    return isValid;
  };

  const nextStep = (e: React.MouseEvent) => {
    e.preventDefault();
    if (validateStep()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Show loader for 3 seconds
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const response = await api.submitSurvey(formData);
      
      if (response.message === 'Survey submitted successfully') {
        // Update the survey submission status
        setHasSubmittedSurvey(true);
        // Redirect to responses page after successful submission
        navigate('/responses');
      } else if (response.error === 'You have already submitted a response') {
        throw new Error('You have already submitted a survey response');
      } else {
        throw new Error('Failed to submit survey. Please try again.');
      }
    } catch (error: any) {
      console.error('Failed to submit survey:', error);
      setErrors(prev => ({
        ...prev,
        submit: error.message || 'Failed to submit survey. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <DemographicForm
            data={formData.demographic}
            errors={errors.demographic}
            onChange={(field, value) => handleInputChange('demographic', field, value)}
          />
        );
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-purple-900/30 p-3 rounded-full border border-purple-500/20">
                  <FaHeartbeat className="w-6 h-6 text-purple-400" />
                </div>
                <h2 className="text-2xl font-semibold text-white">Health Information</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Exercise Frequency <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.health.lifestyle.exercise}
                    onChange={(e) => handleLifestyleChange('exercise', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                  >
                    <option value="">Select frequency</option>
                    {exerciseOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors.health?.lifestyle?.exercise && (
                    <p className="mt-1 text-sm text-red-400">{errors.health.lifestyle.exercise}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Diet Type <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.health.lifestyle.diet}
                    onChange={(e) => handleLifestyleChange('diet', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                  >
                    <option value="">Select diet type</option>
                    {dietOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors.health?.lifestyle?.diet && (
                    <p className="mt-1 text-sm text-red-400">{errors.health.lifestyle.diet}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Smoking</label>
                  <div className="mt-1">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.health.lifestyle.smoking}
                        onChange={(e) => handleLifestyleChange('smoking', e.target.checked)}
                        className="w-4 h-4 text-purple-500 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                      />
                      <span className="ml-2 text-white">Yes, I smoke</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-purple-900/30 p-3 rounded-full border border-purple-500/20">
                  <FaWallet className="w-6 h-6 text-purple-400" />
                </div>
                <h2 className="text-2xl font-semibold text-white">Financial Information</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Annual Income <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.financial.income}
                    onChange={(e) => handleInputChange('financial', 'income', Number(e.target.value))}
                    className="w-full px-4 py-2 bg-gray-700 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Enter your annual income"
                  />
                  {errors.financial?.income && (
                    <p className="mt-1 text-sm text-red-400">{errors.financial.income}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Total Savings <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.financial.savings}
                    onChange={(e) => handleInputChange('financial', 'savings', Number(e.target.value))}
                    className="w-full px-4 py-2 bg-gray-700 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Enter your total savings"
                  />
                  {errors.financial?.savings && (
                    <p className="mt-1 text-sm text-red-400">{errors.financial.savings}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Health Insurance</label>
                  <div className="mt-1">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.financial.insurance}
                        onChange={(e) => handleInputChange('financial', 'insurance', e.target.checked)}
                        className="w-4 h-4 text-purple-500 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                      />
                      <span className="ml-2 text-white">Yes, I have health insurance</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto p-8">
        <div className="flex justify-between items-center mb-12">
          <Link 
            to="/responses"
            className="inline-flex items-center text-purple-400 hover:text-purple-300 font-medium transition-colors"
          >
            <FaArrowLeft className="w-5 h-5 mr-2" />
            View Responses
          </Link>
        </div>

        <div className="bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-800">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Health Survey</h1>
            <p className="text-gray-400">Please complete this survey to help us understand your health and financial situation better.</p>
            <p className="text-sm text-purple-400 mt-2">Fields marked with <span className="text-red-400">*</span> are required</p>
          </div>

          <ProgressIndicator steps={steps} currentStep={currentStep} />

          <form onSubmit={handleSubmit} className="space-y-8">
            {renderStep()}
            
            {errors.submit && (
              <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
                {errors.submit}
              </div>
            )}

            <div className="flex justify-between pt-6">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 0}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  currentStep === 0
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                Previous
              </button>
              {currentStep === steps.length - 1 ? (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    'Submit'
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black transition-all"
                >
                  Next
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 