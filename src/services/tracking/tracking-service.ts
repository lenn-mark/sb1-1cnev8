import { MockTrackingProvider } from './mock-tracking-provider';
import { EmailService } from '../email/email-service';
import { WebhookEventManager } from '../webhook/events';
import { TrackingUpdate } from './types';
import { AlarmService } from '../alarms/alarm-service';

export class TrackingService {
  private provider: MockTrackingProvider;

  constructor(
    private emailService: EmailService,
    private webhookManager: WebhookEventManager,
    private alarmService: AlarmService
  ) {
    this.provider = new MockTrackingProvider(emailService, webhookManager);
  }

  async startTracking(trackingNumber: string): Promise<void> {
    this.provider.subscribeToUpdates(trackingNumber, (update: TrackingUpdate) => {
      console.log(`Tracking update for ${trackingNumber}:`, update);
      this.alarmService.handleTrackingUpdate(update);
    });
  }

  async stopTracking(trackingNumber: string): Promise<void> {
    this.provider.unsubscribeFromUpdates(trackingNumber);
  }

  async getLatestUpdates(trackingNumber: string) {
    return this.provider.getShipmentUpdates(trackingNumber);
  }

  createAlarm(trackingNumber: string, conditions: any[], email: string) {
    return this.alarmService.createAlarm(trackingNumber, conditions, email);
  }

  getAlarms(trackingNumber?: string) {
    return this.alarmService.getAlarms(trackingNumber);
  }

  deactivateAlarm(alarmId: string) {
    return this.alarmService.deactivateAlarm(alarmId);
  }
}