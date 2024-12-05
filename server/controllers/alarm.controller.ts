```typescript
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database';
import { Alarm, AlarmCondition } from '../types';

export class AlarmController {
  async getAlarms(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const scope = req.query.scope as string;

      let query = `
        SELECT a.*, 
               GROUP_CONCAT(ac.id) as condition_ids,
               GROUP_CONCAT(ac.type) as condition_types,
               GROUP_CONCAT(ac.params) as condition_params
        FROM alarms a
        LEFT JOIN alarm_conditions ac ON a.id = ac.alarm_id
        WHERE a.user_id = ?
      `;

      const queryParams: any[] = [userId];

      if (scope) {
        query += ' AND a.scope = ?';
        queryParams.push(scope);
      }

      query += ' GROUP BY a.id ORDER BY a.created_at DESC';

      const [alarms]: any = await pool.query(query, queryParams);

      const formattedAlarms = alarms.map((alarm: any) => ({
        ...alarm,
        conditions: alarm.condition_ids ? 
          alarm.condition_ids.split(',').map((id: string, index: number) => ({
            id,
            type: alarm.condition_types.split(',')[index],
            params: JSON.parse(alarm.condition_params.split(',')[index])
          })) : []
      }));

      res.json(formattedAlarms);
    } catch (error) {
      console.error('Get alarms error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async createAlarm(req: Request, res: Response) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const userId = req.user!.id;
      const { name, scope, trackingNumber, conditions, notifyEmail } = req.body;

      // If scope is specific, verify tracking number exists and belongs to user
      if (scope === 'specific') {
        const [shipments]: any = await connection.query(
          'SELECT id FROM shipments WHERE tracking_number = ? AND user_id = ?',
          [trackingNumber, userId]
        );

        if (shipments.length === 0) {
          return res.status(404).json({ error: 'Tracking number not found' });
        }
      }

      const alarmId = uuidv4();
      await connection.query(
        `INSERT INTO alarms (id, user_id, name, scope, tracking_number, notify_email)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [alarmId, userId, name, scope, trackingNumber, notifyEmail]
      );

      // Create alarm conditions
      for (const condition of conditions) {
        await connection.query(
          `INSERT INTO alarm_conditions (id, alarm_id, type, params)
           VALUES (?, ?, ?, ?)`,
          [uuidv4(), alarmId, condition.type, JSON.stringify(condition.params)]
        );
      }

      await connection.commit();

      const [newAlarm]: any = await connection.query(
        `SELECT a.*, 
                GROUP_CONCAT(ac.id) as condition_ids,
                GROUP_CONCAT(ac.type) as condition_types,
                GROUP_CONCAT(ac.params) as condition_params
         FROM alarms a
         LEFT JOIN alarm_conditions ac ON a.id = ac.alarm_id
         WHERE a.id = ?
         GROUP BY a.id`,
        [alarmId]
      );

      const formattedAlarm = {
        ...newAlarm[0],
        conditions: newAlarm[0].condition_ids.split(',').map((id: string, index: number) => ({
          id,
          type: newAlarm[0].condition_types.split(',')[index],
          params: JSON.parse(newAlarm[0].condition_params.split(',')[index])
        }))
      };

      res.status(201).json(formattedAlarm);
    } catch (error) {
      await connection.rollback();
      console.error('Create alarm error:', error);
      res.status(500).json({ error: 'Internal server error' });
    } finally {
      connection.release();
    }
  }

  async updateAlarm(req: Request, res: Response) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const userId = req.user!.id;
      const alarmId = req.params.id;
      const { name, active, notifyEmail, conditions } = req.body;

      // Verify alarm belongs to user
      const [alarms]: any = await connection.query(
        'SELECT id FROM alarms WHERE id = ? AND user_id = ?',
        [alarmId, userId]
      );

      if (alarms.length === 0) {
        return res.status(404).json({ error: 'Alarm not found' });
      }

      await connection.query(
        'UPDATE alarms SET name = ?, active = ?, notify_email = ? WHERE id = ?',
        [name, active, notifyEmail, alarmId]
      );

      // Update conditions
      await connection.query(
        'DELETE FROM alarm_conditions WHERE alarm_id = ?',
        [alarmId]
      );

      for (const condition of conditions) {
        await connection.query(
          `INSERT INTO alarm_conditions (id, alarm_id, type, params)
           VALUES (?, ?, ?, ?)`,
          [uuidv4(), alarmId, condition.type, JSON.stringify(condition.params)]
        );
      }

      await connection.commit();

      const [updatedAlarm]: any = await connection.query(
        `SELECT a.*, 
                GROUP_CONCAT(ac.id) as condition_ids,
                GROUP_CONCAT(ac.type) as condition_types,
                GROUP_CONCAT(ac.params) as condition_params
         FROM alarms a
         LEFT JOIN alarm_conditions ac ON a.id = ac.alarm_id
         WHERE a.id = ?
         GROUP BY a.id`,
        [alarmId]
      );

      const formattedAlarm = {
        ...updatedAlarm[0],
        conditions: updatedAlarm[0].condition_ids.split(',').map((id: string, index: number) => ({
          id,
          type: updatedAlarm[0].condition_types.split(',')[index],
          params: JSON.parse(updatedAlarm[0].condition_params.split(',')[index])
        }))
      };

      res.json(formattedAlarm);
    } catch (error) {
      await connection.rollback();
      console.error('Update alarm error:', error);
      res.status(500).json({ error: 'Internal server error' });
    } finally {
      connection.release();
    }
  }

  async getTriggeredShipments(req: Request, res: Response) {
    try {
      const userId = req.user!.id;

      const [triggeredShipments]: any = await pool.query(
        `SELECT a.id as alarm_id, a.name as alarm_name, a.scope,
                s.*, ts.triggered_at,
                GROUP_CONCAT(DISTINCT t.id) as tag_ids,
                GROUP_CONCAT(DISTINCT t.name) as tag_names,
                GROUP_CONCAT(DISTINCT t.color) as tag_colors
         FROM triggered_shipments ts
         JOIN alarms a ON ts.alarm_id = a.id
         JOIN shipments s ON ts.shipment_id = s.id
         LEFT JOIN shipment_tags st ON s.id = st.shipment_id
         LEFT JOIN tags t ON st.tag_id = t.id
         WHERE a.user_id = ?
         GROUP BY ts.id
         ORDER BY ts.triggered_at DESC`,
        [userId]
      );

      const groupedShipments = triggeredShipments.reduce((acc: any, curr: any) => {
        if (!acc[curr.alarm_id]) {
          acc[curr.alarm_id] = {
            alarm: {
              id: curr.alarm_id,
              name: curr.alarm_name,
              scope: curr.scope
            },
            shipments: []
          };
        }

        acc[curr.alarm_id].shipments.push({
          ...curr,
          tags: curr.tag_ids ? curr.tag_ids.split(',').map((id: string, index: number) => ({
            id,
            name: curr.tag_names.split(',')[index],
            color: curr.tag_colors.split(',')[index]
          })) : []
        });

        return acc;
      }, {});

      res.json(groupedShipments);
    } catch (error) {
      console.error('Get triggered shipments error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async removeTriggeredShipment(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { alarmId, shipmentId } = req.params;

      // Verify alarm belongs to user
      const [alarms]: any = await pool.query(
        'SELECT id FROM alarms WHERE id = ? AND user_id = ?',
        [alarmId, userId]
      );

      if (alarms.length === 0) {
        return res.status(404).json({ error: 'Alarm not found' });
      }

      await pool.query(
        'DELETE FROM triggered_shipments WHERE alarm_id = ? AND shipment_id = ?',
        [alarmId, shipmentId]
      );

      res.json({ message: 'Triggered shipment removed' });
    } catch (error) {
      console.error('Remove triggered shipment error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
```