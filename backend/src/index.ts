import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import surveyRoutes from './routes/surveyRoutes';
import authRoutes from './routes/authRoutes';
import { pool } from './db/index';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/survey', surveyRoutes);

// Initialize database
const initDatabase = async () => {
    try {
        // Read and execute schema.sql
        const schemaPath = path.join(__dirname, 'db', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        await pool.query(schema);
        console.log('Database schema initialized successfully');

        // Start the server
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Database initialization error:', error);
        process.exit(1);
    }
};

initDatabase();
