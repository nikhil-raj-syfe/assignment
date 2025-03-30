import React from 'react';

interface Step {
  id: string;
  title: string;
}

interface ProgressIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export default function ProgressIndicator({ steps, currentStep }: ProgressIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="grid grid-cols-3 gap-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-colors duration-200 ${
                index <= currentStep 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-700 text-gray-400'
              }`}
            >
              {index + 1}
            </div>
            <span className="text-sm text-gray-400 text-center">{step.title}</span>
          </div>
        ))}
      </div>
      <div className="relative mt-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-1 bg-gray-700">
            <div 
              className="h-full bg-purple-600 transition-all duration-300"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 