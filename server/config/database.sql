-- Create database
CREATE DATABASE IF NOT EXISTS shipment_tracking;
USE shipment_tracking;

-- Users table
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Reset tokens for password recovery
CREATE TABLE reset_tokens (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  token VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Subscriptions
CREATE TABLE subscriptions (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) UNIQUE NOT NULL,
  plan VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Shipments
CREATE TABLE shipments (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  tracking_number VARCHAR(100) NOT NULL,
  carrier_id VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  origin_city VARCHAR(100) NOT NULL,
  origin_country VARCHAR(100) NOT NULL,
  destination_city VARCHAR(100) NOT NULL,
  destination_country VARCHAR(100) NOT NULL,
  estimated_delivery TIMESTAMP,
  latest_delivery_date TIMESTAMP,
  internal_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Orders
CREATE TABLE orders (
  id VARCHAR(36) PRIMARY KEY,
  shipment_id VARCHAR(36) NOT NULL,
  order_id VARCHAR(100) NOT NULL,
  platform_id VARCHAR(50) NOT NULL,
  platform_name VARCHAR(100) NOT NULL,
  buyer_name VARCHAR(255) NOT NULL,
  buyer_phone VARCHAR(50),
  buyer_email VARCHAR(255),
  address_line1 VARCHAR(255) NOT NULL,
  address_line2 VARCHAR(255),
  address_city VARCHAR(100) NOT NULL,
  address_state VARCHAR(100) NOT NULL,
  address_postal_code VARCHAR(20) NOT NULL,
  address_country VARCHAR(100) NOT NULL,
  address_latitude DECIMAL(10, 8),
  address_longitude DECIMAL(11, 8),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE
);

-- Tracking events
CREATE TABLE tracking_events (
  id VARCHAR(36) PRIMARY KEY,
  shipment_id VARCHAR(36) NOT NULL,
  status VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE
);

-- Tags
CREATE TABLE tags (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  color VARCHAR(7) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Shipment tags
CREATE TABLE shipment_tags (
  shipment_id VARCHAR(36) NOT NULL,
  tag_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (shipment_id, tag_id),
  FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- Alarms
CREATE TABLE alarms (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  scope VARCHAR(50) NOT NULL,
  tracking_number VARCHAR(100),
  notify_email VARCHAR(255) NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Alarm conditions
CREATE TABLE alarm_conditions (
  id VARCHAR(36) PRIMARY KEY,
  alarm_id VARCHAR(36) NOT NULL,
  type VARCHAR(50) NOT NULL,
  params JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (alarm_id) REFERENCES alarms(id) ON DELETE CASCADE
);

-- Triggered shipments
CREATE TABLE triggered_shipments (
  id VARCHAR(36) PRIMARY KEY,
  alarm_id VARCHAR(36) NOT NULL,
  shipment_id VARCHAR(36) NOT NULL,
  triggered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (alarm_id) REFERENCES alarms(id) ON DELETE CASCADE,
  FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE
);

-- Settings
CREATE TABLE settings (
  user_id VARCHAR(36) PRIMARY KEY,
  notification_preferences JSON NOT NULL,
  webhook_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_shipments_tracking ON shipments(tracking_number);
CREATE INDEX idx_shipments_status ON shipments(status);
CREATE INDEX idx_tracking_events_timestamp ON tracking_events(timestamp);
CREATE INDEX idx_alarms_scope ON alarms(scope);
CREATE INDEX idx_triggered_shipments_alarm ON triggered_shipments(alarm_id);
CREATE INDEX idx_reset_tokens_expires ON reset_tokens(expires_at);