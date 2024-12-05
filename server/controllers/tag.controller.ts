import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database';

export class TagController {
  async getTags(req: Request, res: Response) {
    try {
      const [tags]: any = await pool.query(
        'SELECT * FROM tags ORDER BY created_at DESC'
      );

      res.json(tags);
    } catch (error) {
      console.error('Get tags error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async createTag(req: Request, res: Response) {
    try {
      const { name, color } = req.body;

      // Check if tag with same name exists
      const [existingTags]: any = await pool.query(
        'SELECT id FROM tags WHERE name = ?',
        [name]
      );

      if (existingTags.length > 0) {
        return res.status(400).json({ error: 'Tag with this name already exists' });
      }

      const tagId = uuidv4();
      await pool.query(
        'INSERT INTO tags (id, name, color) VALUES (?, ?, ?)',
        [tagId, name, color]
      );

      const [newTag]: any = await pool.query(
        'SELECT * FROM tags WHERE id = ?',
        [tagId]
      );

      res.status(201).json(newTag[0]);
    } catch (error) {
      console.error('Create tag error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async addTagToShipment(req: Request, res: Response) {
    try {
      const { shipmentId, tagId } = req.params;
      const userId = req.user!.id;

      // Verify shipment belongs to user
      const [shipments]: any = await pool.query(
        'SELECT id FROM shipments WHERE id = ? AND user_id = ?',
        [shipmentId, userId]
      );

      if (shipments.length === 0) {
        return res.status(404).json({ error: 'Shipment not found' });
      }

      // Check if tag exists
      const [tags]: any = await pool.query(
        'SELECT id FROM tags WHERE id = ?',
        [tagId]
      );

      if (tags.length === 0) {
        return res.status(404).json({ error: 'Tag not found' });
      }

      // Check if tag is already added to shipment
      const [existingTags]: any = await pool.query(
        'SELECT * FROM shipment_tags WHERE shipment_id = ? AND tag_id = ?',
        [shipmentId, tagId]
      );

      if (existingTags.length > 0) {
        return res.status(400).json({ error: 'Tag already added to shipment' });
      }

      await pool.query(
        'INSERT INTO shipment_tags (shipment_id, tag_id) VALUES (?, ?)',
        [shipmentId, tagId]
      );

      res.status(201).json({ message: 'Tag added to shipment' });
    } catch (error) {
      console.error('Add tag to shipment error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async removeTagFromShipment(req: Request, res: Response) {
    try {
      const { shipmentId, tagId } = req.params;
      const userId = req.user!.id;

      // Verify shipment belongs to user
      const [shipments]: any = await pool.query(
        'SELECT id FROM shipments WHERE id = ? AND user_id = ?',
        [shipmentId, userId]
      );

      if (shipments.length === 0) {
        return res.status(404).json({ error: 'Shipment not found' });
      }

      await pool.query(
        'DELETE FROM shipment_tags WHERE shipment_id = ? AND tag_id = ?',
        [shipmentId, tagId]
      );

      res.json({ message: 'Tag removed from shipment' });
    } catch (error) {
      console.error('Remove tag from shipment error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getShipmentTags(req: Request, res: Response) {
    try {
      const { shipmentId } = req.params;
      const userId = req.user!.id;

      // Verify shipment belongs to user
      const [shipments]: any = await pool.query(
        'SELECT id FROM shipments WHERE id = ? AND user_id = ?',
        [shipmentId, userId]
      );

      if (shipments.length === 0) {
        return res.status(404).json({ error: 'Shipment not found' });
      }

      const [tags]: any = await pool.query(
        `SELECT t.* 
         FROM tags t
         JOIN shipment_tags st ON t.id = st.tag_id
         WHERE st.shipment_id = ?`,
        [shipmentId]
      );

      res.json(tags);
    } catch (error) {
      console.error('Get shipment tags error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}