import { Request, Response } from 'express';
import { pool } from '../db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    // Get user from database
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1 AND password = $2',
      [username, password]
    );

    const user = result.rows[0];

    // Check if user exists
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id,
        username: user.username,
        isAdmin: user.is_admin 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        isAdmin: user.is_admin
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const result = await pool.query(
      'SELECT id, username, is_admin FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const user = result.rows[0];
    res.json({
      user: {
        id: user.id,
        username: user.username,
        isAdmin: user.is_admin
      }
    });
  } catch (error) {
    console.error('Get user info error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const checkUserResponse = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const result = await pool.query(
      'SELECT id FROM survey_responses WHERE id = $1',
      [userId]
    );

    res.json({ hasResponse: result.rows.length > 0 });
  } catch (error) {
    console.error('Check user response error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const signup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            res.status(400).json({ error: 'Username and password are required' });
            return;
        }

        // Check if username already exists
        const existingUser = await pool.query(
            'SELECT id FROM users WHERE username = $1',
            [username]
        );

        if (existingUser.rows.length > 0) {
            res.status(400).json({ error: 'Username already exists' });
            return;
        }

        // Insert new user with plaintext password
        const result = await pool.query(
            'INSERT INTO users (username, password, is_admin) VALUES ($1, $2, false) RETURNING id, username, is_admin',
            [username, password]
        );

        const user = result.rows[0];

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, username: user.username, isAdmin: user.is_admin },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: user.id,
                username: user.username,
                isAdmin: user.is_admin
            }
        });
    } catch (error) {
        console.error('Error in signup:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
}; 