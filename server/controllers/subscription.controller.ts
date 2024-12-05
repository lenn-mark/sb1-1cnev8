```typescript
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database';

export class SubscriptionController {
  async getSubscriptionDetails(req: Request, res: Response) {
    try {
      const userId = req.user!.id;

      const [subscriptions]: any = await pool.query(
        `SELECT s.*, 
                COUNT(sh.id) as shipment_count
         FROM subscriptions s
         LEFT JOIN shipments sh ON s.user_id = sh.user_id 
            AND sh.created_at >= s.start_date 
            AND (sh.created_at <= s.end_date OR s.end_date IS NULL)
         WHERE s.user_id = ?
         GROUP BY s.id`,
        [userId]
      );

      if (subscriptions.length === 0) {
        return res.status(404).json({ error: 'No active subscription found' });
      }

      const subscription = subscriptions[0];

      res.json({
        currentPlan: subscription.plan,
        status: subscription.status,
        startDate: subscription.start_date,
        endDate: subscription.end_date,
        shipmentCount: subscription.shipment_count,
        isActive: subscription.status === 'active'
      });
    } catch (error) {
      console.error('Get subscription details error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getBillingHistory(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      const [invoices]: any = await pool.query(
        `SELECT * FROM billing_history 
         WHERE user_id = ? 
         ORDER BY date DESC 
         LIMIT ? OFFSET ?`,
        [userId, limit, offset]
      );

      const [total]: any = await pool.query(
        'SELECT COUNT(*) as count FROM billing_history WHERE user_id = ?',
        [userId]
      );

      res.json({
        invoices,
        pagination: {
          total: total[0].count,
          page,
          totalPages: Math.ceil(total[0].count / limit)
        }
      });
    } catch (error) {
      console.error('Get billing history error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async upgradePlan(req: Request, res: Response) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const userId = req.user!.id;
      const { plan } = req.body;

      // End current subscription if exists
      await connection.query(
        `UPDATE subscriptions 
         SET end_date = CURRENT_TIMESTAMP, status = 'ended'
         WHERE user_id = ? AND status = 'active'`,
        [userId]
      );

      // Create new subscription
      const subscriptionId = uuidv4();
      await connection.query(
        `INSERT INTO subscriptions (id, user_id, plan, status, start_date)
         VALUES (?, ?, ?, 'active', CURRENT_TIMESTAMP)`,
        [subscriptionId, userId, plan]
      );

      await connection.commit();

      const [newSubscription]: any = await connection.query(
        'SELECT * FROM subscriptions WHERE id = ?',
        [subscriptionId]
      );

      res.json(newSubscription[0]);
    } catch (error) {
      await connection.rollback();
      console.error('Upgrade plan error:', error);
      res.status(500).json({ error: 'Internal server error' });
    } finally {
      connection.release();
    }
  }

  async cancelSubscription(req: Request, res: Response) {
    try {
      const userId = req.user!.id;

      await pool.query(
        `UPDATE subscriptions 
         SET end_date = CURRENT_TIMESTAMP, status = 'cancelled'
         WHERE user_id = ? AND status = 'active'`,
        [userId]
      );

      res.json({ message: 'Subscription cancelled successfully' });
    } catch (error) {
      console.error('Cancel subscription error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
```