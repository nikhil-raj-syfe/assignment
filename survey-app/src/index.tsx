import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SurveyProvider, useSurvey } from './contexts/SurveyContext';
import Navigation from './components/Navigation';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import SurveyPage from './pages/SurveyPage';
import ResponsesPage from './pages/ResponsesPage';
import ResponseDetailPage from './pages/ResponseDetailPage';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const DefaultRedirect = () => {
  const { user } = useAuth();
  const { hasSubmittedSurvey } = useSurvey();

  if (!user) return <Navigate to="/signin" replace />;
  
  // Admin always goes to all responses
  if (user.isAdmin) {
    return <Navigate to="/responses" replace />;
  }
  
  // Non-admin users: if they've taken the survey, go to responses, otherwise to survey
  return <Navigate to={hasSubmittedSurvey ? '/responses' : '/survey'} replace />;
};

// Protect survey page if user has already submitted
const ProtectedSurveyPage = () => {
  const { user } = useAuth();
  const { hasSubmittedSurvey } = useSurvey();

  if (user?.isAdmin) {
    // Admins shouldn't access the survey page
    return <Navigate to="/responses" replace />;
  }

  if (hasSubmittedSurvey) {
    // Users who have submitted shouldn't access the survey page
    return <Navigate to="/responses" replace />;
  }

  return <SurveyPage />;
};

root.render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <SurveyProvider>
          <div className="min-h-screen bg-black text-white">
            <Navigation />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<DefaultRedirect />} />
                <Route path="/signin" element={<SignInPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/survey" element={<ProtectedSurveyPage />} />
                <Route path="/responses" element={<ResponsesPage />} />
                <Route path="/responses/:id" element={<ResponseDetailPage />} />
              </Routes>
            </main>
          </div>
        </SurveyProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>
); 