import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Survey from '../components/Survey';

export default function SurveyPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    navigate('/signin');
    return null;
  }

  return (
    <div className="container mx-auto px-4">
      <Survey />
    </div>
  );
} 