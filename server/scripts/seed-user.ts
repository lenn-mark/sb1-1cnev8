import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database';

async function createDemoUser() {
  const userId = uuidv4();
  const email = 'demo@shiptrack.com';
  const password = 'ShipTrack2024!';
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await pool.query(
      'INSERT INTO users (id, email, password, is_admin) VALUES (?, ?, ?, ?)',
      [userId, email, hashedPassword, false]
    );

    console.log('Demo user created successfully:');
    console.log('Email:', email);
    console.log('Password:', password);
  } catch (error) {
    console.error('Error creating demo user:', error);
  }
}

createDemoUser();