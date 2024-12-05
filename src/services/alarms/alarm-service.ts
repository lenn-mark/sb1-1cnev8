import { v4 as uuidv4 } from 'uuid';
import { Alarm, AlarmCondition, AlarmViolation } from './types';
import { AlarmEvaluator } from './alarm-evaluator';
import { EmailService } from '../email/email-service';
import { TrackingUpdate } from '../tracking/types';

export class AlarmService {
  private alarms: Map<string, Alarm> = new Map();
  private firstEvents: Map<string, Date> = new Map();
  private evaluator: AlarmEvaluator;

  constructor(private emailService: EmailService) {
    this.evaluator = new AlarmEvaluator();
  }

  createAlarm(
    trackingNumber: string,
    conditions: AlarmCondition[],
    notifyEmail: string
  ): Alarm {
    const alarm: Alarm = {
      id: uuidv4(),
      trackingNumber,
      conditions,
      notifyEmail,
      active: true,
      createdAt: new Date()
    };

    this.alarms.set(alarm.id, alarm);
    return alarm;
  }

  handleTrackingUpdate(update: TrackingUpdate): void {
    // Record first event for transit time calculations
    if (!this.firstEvents.has(update.trackingNumber)) {
      this.firstEvents.set(update.trackingNumber, update.timestamp);
    }

    const firstEventDate = this.firstEvents.get(update.trackingNumber)!;
    const violations: AlarmViolation[] = [];

    // Check all active alarms for this tracking number
    for (const alarm of this.alarms.values()) {
      if (alarm.trackingNumber === update.trackingNumber && alarm.active) {
        const alarmViolations = this.evaluator.evaluateUpdate(alarm, update, firstEventDate);
        violations.push(...alarmViolations);
      }
    }

    // Handle violations
    this.handleViolations(violations);
  }

  private async handleViolations(violations: AlarmViolation[]): Promise<void> {
    for (const violation of violations) {
      const alarm = this.alarms.get(violation.alarmId);
      if (!alarm) continue;

      await this.emailService.sendShipmentUpdate(alarm.notifyEmail, {
        trackingNumber: violation.trackingNumber,
        status: violation.update.status,
        location: `${violation.update.location.city}, ${violation.update.location.country}`,
        timestamp: violation.update.timestamp
      });
    }
  }

  deactivateAlarm(alarmId: string): boolean {
    const alarm = this.alarms.get(alarmId);
    if (alarm) {
      alarm.active = false;
      return true;
    }
    return false;
  }

  getAlarms(trackingNumber?: string): Alarm[] {
    const alarms = Array.from(this.alarms.values());
    return trackingNumber 
      ? alarms.filter(alarm => alarm.trackingNumber === trackingNumber)
      : alarms;
  }
}