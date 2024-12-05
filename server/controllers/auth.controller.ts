import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database';
import { validateEmail, validatePassword } from '../utils/validation';
import { sendResetPasswordEmail } from '../utils/email';

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const [users]: any = await pool.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      if (users.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const user = users[0];
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user.id, isAdmin: user.is_admin },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          isAdmin: user.is_admin
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async register(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!validateEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }

      if (!validatePassword(password)) {
        return res.status(400).json({ 
          error: 'Password must be at least 8 characters long and contain uppercase, lowercase, and numbers' 
        });
      }

      const [existingUsers]: any = await pool.query(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );

      if (existingUsers.length > 0) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = uuidv4();

      await pool.query(
        'INSERT INTO users (id, email, password) VALUES (?, ?, ?)',
        [userId, email, hashedPassword]
      );

      // Create default settings for the user
      await pool.query(
        'INSERT INTO settings (user_id, notification_preferences) VALUES (?, ?)',
        [userId, JSON.stringify({ email: true, daily_summary: false })]
      );

      const token = jwt.sign(
        { userId, isAdmin: false },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.status(201).json({
        token,
        user: {
          id: userId,
          email,
          isAdmin: false
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      const [users]: any = await pool.query(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );

      if (users.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const user = users[0];
      const resetToken = uuidv4();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1); // Token expires in 1 hour

      await pool.query(
        'INSERT INTO reset_tokens (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)',
        [uuidv4(), user.id, resetToken, expiresAt]
      );

      await sendResetPasswordEmail(email, resetToken);

      res.json({ message: 'Password reset email sent' });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({ error: 'Token and new password are required' });
      }

      if (!validatePassword(newPassword)) {
        return res.status(400).json({ 
          error: 'Password must be at least 8 characters long and contain uppercase, lowercase, and numbers' 
        });
      }

      const [tokens]: any = await pool.query(
        'SELECT user_id FROM reset_tokens WHERE token = ? AND expires_at > NOW() AND used = 0',
        [token]
      );

      if (tokens.length === 0) {
        return res.status(400).json({ error: 'Invalid or expired token' });
      }

      const userId = tokens[0].user_id;
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await pool.query(
        'UPDATE users SET password = ? WHERE id = ?',
        [hashedPassword, userId]
      );

      await pool.query(
        'UPDATE reset_tokens SET used = 1 WHERE token = ?',
        [token]
      );

      res.json({ message: 'Password reset successful' });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}