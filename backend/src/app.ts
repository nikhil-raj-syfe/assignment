import express from 'express';
import cors from 'cors';
import surveyRoutes from './routes/surveyRoutes';
import authRoutes from './routes/authRoutes';
import { authenticateToken } from './middleware/auth';

const app = express();

app.use(cors());
app.use(express.json());

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/survey', authenticateToken, surveyRoutes);

export default app; 