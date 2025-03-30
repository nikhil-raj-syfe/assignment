import { Request as ExpressRequest, Response } from 'express';
import { pool } from '../db';

interface CustomRequest extends ExpressRequest {
  user?: {
    id: string;
    username: string;
    isAdmin: boolean;
  };
}

export const submitSurvey = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }

        // Check if user has already submitted a response
        const existingResponse = await pool.query(
            'SELECT response_id FROM survey_responses WHERE user_id = $1',
            [userId]
        );

        if (existingResponse.rows.length > 0) {
            res.status(400).json({ 
                error: 'You have already submitted a response',
                responseId: existingResponse.rows[0].response_id
            });
            return;
        }

        const { demographic, health, financial } = req.body;

        const result = await pool.query(
            `INSERT INTO survey_responses 
            (user_id, demographic, health, financial) 
            VALUES ($1, $2, $3, $4) 
            RETURNING response_id, demographic, health, financial, created_at`,
            [userId, demographic, health, financial]
        );

        res.status(201).json({
            message: 'Survey submitted successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error submitting survey:', error);
        res.status(500).json({ error: 'Failed to submit survey' });
    }
};

export const getSurveyResponses = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const isAdmin = req.user?.isAdmin;

        if (!userId) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }

        let query;
        let params: any[] = [];

        if (isAdmin) {
            // Admin can see all responses with user info
            query = `
                SELECT 
                    sr.response_id,
                    sr.user_id,
                    u.username,
                    sr.demographic,
                    sr.health,
                    sr.financial,
                    sr.created_at
                FROM survey_responses sr
                JOIN users u ON sr.user_id = u.id
                ORDER BY sr.created_at DESC
            `;
        } else {
            // Regular users can only see their own response
            query = `
                SELECT 
                    sr.response_id,
                    sr.user_id,
                    u.username,
                    sr.demographic,
                    sr.health,
                    sr.financial,
                    sr.created_at
                FROM survey_responses sr
                JOIN users u ON sr.user_id = u.id
                WHERE sr.user_id = $1
                ORDER BY sr.created_at DESC
            `;
            params = [userId];
        }

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching survey responses:', error);
        res.status(500).json({ error: 'Failed to fetch survey responses' });
    }
};

export const getSurveyResponse = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const isAdmin = req.user?.isAdmin;

        if (!userId) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }

        const result = await pool.query(
            `SELECT 
                sr.response_id,
                sr.user_id,
                u.username,
                sr.demographic,
                sr.health,
                sr.financial,
                sr.created_at
            FROM survey_responses sr
            JOIN users u ON sr.user_id = u.id
            WHERE sr.response_id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Survey response not found' });
            return;
        }

        const response = result.rows[0];

        // Check if user has permission to view this response
        if (!isAdmin && response.user_id !== userId) {
            res.status(403).json({ error: 'Access denied' });
            return;
        }

        res.json(response);
    } catch (error) {
        console.error('Error fetching survey response:', error);
        res.status(500).json({ error: 'Failed to fetch survey response' });
    }
}; 