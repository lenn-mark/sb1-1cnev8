export type AlarmConditionType = 
  | 'transit_time'
  | 'status_duration'
  | 'description_match'
  | 'delivery_date';

export interface AlarmCondition {
  type: AlarmConditionType;
  params: {
    maxDays?: number;
    keywords?: string[];
    status?: string;
    durationHours?: number;
    latestDeliveryDate?: Date;
  };
}

export interface Alarm {
  id: string;
  name: string;
  conditions: AlarmCondition[];
  notifyEmail: string;
  active: boolean;
  createdAt: Date;
  scope: 'global' | 'specific';
  trackingNumber?: string;
}

export interface AlarmViolation {
  alarmId: string;
  trackingNumber: string;
  condition: AlarmCondition;
  update: TrackingUpdate;
  timestamp: Date;
}