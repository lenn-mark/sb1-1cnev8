import { differenceInDays, differenceInHours } from 'date-fns';
import { Alarm, AlarmCondition, AlarmViolation } from './types';
import { TrackingUpdate } from '../tracking/types';

export class AlarmEvaluator {
  evaluateUpdate(alarm: Alarm, update: TrackingUpdate, firstEventDate: Date): AlarmViolation[] {
    const violations: AlarmViolation[] = [];

    for (const condition of alarm.conditions) {
      if (this.checkCondition(condition, update, firstEventDate)) {
        violations.push({
          alarmId: alarm.id,
          trackingNumber: alarm.trackingNumber,
          condition,
          update,
          timestamp: new Date()
        });
      }
    }

    return violations;
  }

  private checkCondition(
    condition: AlarmCondition,
    update: TrackingUpdate,
    firstEventDate: Date
  ): boolean {
    switch (condition.type) {
      case 'transit_time':
        return this.checkTransitTime(condition, firstEventDate);
      case 'status_duration':
        return this.checkStatusDuration(condition, update);
      case 'description_match':
        return this.checkDescriptionMatch(condition, update);
      default:
        return false;
    }
  }

  private checkTransitTime(condition: AlarmCondition, firstEventDate: Date): boolean {
    if (!condition.params.maxDays) return false;
    const transitDays = differenceInDays(new Date(), firstEventDate);
    return transitDays > condition.params.maxDays;
  }

  private checkStatusDuration(condition: AlarmCondition, update: TrackingUpdate): boolean {
    if (!condition.params.status || !condition.params.durationHours) return false;
    const statusDuration = differenceInHours(new Date(), update.timestamp);
    return update.status === condition.params.status && 
           statusDuration > condition.params.durationHours;
  }

  private checkDescriptionMatch(condition: AlarmCondition, update: TrackingUpdate): boolean {
    if (!condition.params.keywords || condition.params.keywords.length === 0) return false;
    const description = update.description.toLowerCase();
    return condition.params.keywords.some(keyword => 
      description.includes(keyword.toLowerCase())
    );
  }
}