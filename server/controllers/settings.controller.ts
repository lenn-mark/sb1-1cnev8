```typescript
import { Request, Response } from 'express';
import pool from '../config/database';

export class SettingsController {
  async getSettings(req: Request, res: Response) {
    try {
      const userId = req.user!.id;

      const [settings]: any = await pool.query(
        'SELECT * FROM settings WHERE user_id = ?',
        [userId]
      );

      if (settings.length === 0) {
        return res.status(404).json({ error: 'Settings not found' });
      }

      res.json({
        notificationPreferences: JSON.parse(settings[0].notification_preferences),
        webhookUrl: settings[0].webhook_url
      });
    } catch (error) {
      console.error('Get settings error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateSettings(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { notificationPreferences, webhookUrl } = req.body;

      await pool.query(
        `UPDATE settings 
         SET notification_preferences = ?, webhook_url = ?
         WHERE user_id = ?`,
        [JSON.stringify(notificationPreferences), webhookUrl, userId]
      );

      const [updatedSettings]: any = await pool.query(
        'SELECT * FROM settings WHERE user_id = ?',
        [userId]
      );

      res.json({
        notificationPreferences: JSON.parse(updatedSettings[0].notification_preferences),
        webhookUrl: updatedSettings[0].webhook_url
      });
    } catch (error) {
      console.error('Update settings error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateApiKey(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const apiKey = `sk_${Math.random().toString(36).substr(2, 9)}`;

      await pool.query(
        'UPDATE users SET api_key = ? WHERE id = ?',
        [apiKey, userId]
      );

      res.json({ apiKey });
    } catch (error) {
      console.error('Update API key error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
```