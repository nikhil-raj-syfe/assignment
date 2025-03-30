import express from 'express';
import { submitSurvey, getSurveyResponses, getSurveyResponse } from '../controllers/surveyController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.post('/submit', authenticateToken, submitSurvey);
router.get('/response/:id', authenticateToken, getSurveyResponse);
router.get('/responses', authenticateToken, getSurveyResponses);

export default router; 