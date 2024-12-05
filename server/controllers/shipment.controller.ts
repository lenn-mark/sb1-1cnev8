import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database';
import { Shipment, TrackingEvent, Order } from '../types';

export class ShipmentController {
  async getActiveShipments(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      const [shipments]: any = await pool.query(
        `SELECT s.*, 
                GROUP_CONCAT(DISTINCT t.id) as tag_ids,
                GROUP_CONCAT(DISTINCT t.name) as tag_names,
                GROUP_CONCAT(DISTINCT t.color) as tag_colors
         FROM shipments s
         LEFT JOIN shipment_tags st ON s.id = st.shipment_id
         LEFT JOIN tags t ON st.tag_id = t.id
         WHERE s.user_id = ? AND s.status != 'delivered'
         GROUP BY s.id
         ORDER BY s.created_at DESC
         LIMIT ? OFFSET ?`,
        [userId, limit, offset]
      );

      const [total]: any = await pool.query(
        'SELECT COUNT(*) as count FROM shipments WHERE user_id = ? AND status != "delivered"',
        [userId]
      );

      const formattedShipments = shipments.map((shipment: any) => ({
        ...shipment,
        tags: shipment.tag_ids ? shipment.tag_ids.split(',').map((id: string, index: number) => ({
          id,
          name: shipment.tag_names.split(',')[index],
          color: shipment.tag_colors.split(',')[index]
        })) : []
      }));

      res.json({
        shipments: formattedShipments,
        pagination: {
          total: total[0].count,
          page,
          totalPages: Math.ceil(total[0].count / limit)
        }
      });
    } catch (error) {
      console.error('Get active shipments error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async createShipment(req: Request, res: Response) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const userId = req.user!.id;
      const {
        trackingNumber,
        carrierId,
        order
      } = req.body;

      // Check if tracking number already exists for this user
      const [existingShipments]: any = await connection.query(
        'SELECT id FROM shipments WHERE user_id = ? AND tracking_number = ?',
        [userId, trackingNumber]
      );

      if (existingShipments.length > 0) {
        return res.status(400).json({ error: 'Tracking number already exists' });
      }

      const shipmentId = uuidv4();
      await connection.query(
        `INSERT INTO shipments (
          id, user_id, tracking_number, carrier_id, status,
          origin_city, origin_country, destination_city, destination_country
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          shipmentId,
          userId,
          trackingNumber,
          carrierId,
          'pending',
          order.origin.city,
          order.origin.country,
          order.destination.city,
          order.destination.country
        ]
      );

      // Create order record
      const orderId = uuidv4();
      await connection.query(
        `INSERT INTO orders (
          id, shipment_id, order_id, platform_id, platform_name,
          buyer_name, buyer_phone, address_line1, address_line2,
          address_city, address_state, address_postal_code, address_country
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          shipmentId,
          order.orderId,
          order.platform.id,
          order.platform.name,
          order.buyer.name,
          order.buyer.phoneNumber,
          order.buyer.address.line1,
          order.buyer.address.line2 || null,
          order.buyer.address.city,
          order.buyer.address.state,
          order.buyer.address.postalCode,
          order.buyer.address.country
        ]
      );

      await connection.commit();

      res.status(201).json({
        id: shipmentId,
        trackingNumber,
        status: 'pending',
        carrierId
      });
    } catch (error) {
      await connection.rollback();
      console.error('Create shipment error:', error);
      res.status(500).json({ error: 'Internal server error' });
    } finally {
      connection.release();
    }
  }

  async getShipmentDetails(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const shipmentId = req.params.id;

      const [shipments]: any = await pool.query(
        `SELECT s.*, 
                o.*,
                GROUP_CONCAT(DISTINCT t.id) as tag_ids,
                GROUP_CONCAT(DISTINCT t.name) as tag_names,
                GROUP_CONCAT(DISTINCT t.color) as tag_colors
         FROM shipments s
         LEFT JOIN orders o ON s.id = o.shipment_id
         LEFT JOIN shipment_tags st ON s.id = st.shipment_id
         LEFT JOIN tags t ON st.tag_id = t.id
         WHERE s.id = ? AND s.user_id = ?
         GROUP BY s.id`,
        [shipmentId, userId]
      );

      if (shipments.length === 0) {
        return res.status(404).json({ error: 'Shipment not found' });
      }

      const [events]: any = await pool.query(
        'SELECT * FROM tracking_events WHERE shipment_id = ? ORDER BY timestamp DESC',
        [shipmentId]
      );

      const shipment = shipments[0];
      const formattedShipment = {
        ...shipment,
        tags: shipment.tag_ids ? shipment.tag_ids.split(',').map((id: string, index: number) => ({
          id,
          name: shipment.tag_names.split(',')[index],
          color: shipment.tag_colors.split(',')[index]
        })) : [],
        events,
        order: {
          orderId: shipment.order_id,
          platform: {
            id: shipment.platform_id,
            name: shipment.platform_name
          },
          buyer: {
            name: shipment.buyer_name,
            phoneNumber: shipment.buyer_phone,
            address: {
              line1: shipment.address_line1,
              line2: shipment.address_line2,
              city: shipment.address_city,
              state: shipment.address_state,
              postalCode: shipment.address_postal_code,
              country: shipment.address_country
            }
          }
        }
      };

      res.json(formattedShipment);
    } catch (error) {
      console.error('Get shipment details error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}