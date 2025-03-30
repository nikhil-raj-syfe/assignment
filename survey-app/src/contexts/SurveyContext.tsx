import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../utils/api';

interface SurveyContextType {
  hasSubmittedSurvey: boolean;
  setHasSubmittedSurvey: (value: boolean) => void;
  checkSurveyStatus: () => Promise<void>;
}

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

export function SurveyProvider({ children }: { children: React.ReactNode }) {
  const [hasSubmittedSurvey, setHasSubmittedSurvey] = useState(false);
  const { user } = useAuth();

  const checkSurveyStatus = async () => {
    if (!user) {
      setHasSubmittedSurvey(false);
      return;
    }

    try {
      const responses = await api.getResponses(false);
      setHasSubmittedSurvey(responses.length > 0);
    } catch (error) {
      console.error('Failed to check survey status:', error);
      setHasSubmittedSurvey(false);
    }
  };

  useEffect(() => {
    checkSurveyStatus();
  }, [user]);

  return (
    <SurveyContext.Provider value={{ hasSubmittedSurvey, setHasSubmittedSurvey, checkSurveyStatus }}>
      {children}
    </SurveyContext.Provider>
  );
}

export function useSurvey() {
  const context = useContext(SurveyContext);
  if (context === undefined) {
    throw new Error('useSurvey must be used within a SurveyProvider');
  }
  return context;
} 