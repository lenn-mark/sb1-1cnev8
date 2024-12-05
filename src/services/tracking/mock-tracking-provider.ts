import { TrackingProvider, TrackingUpdate, ShipmentStatus } from './types';
import { locations, statusDescriptions } from './mock-data';
import { TrackingEvent } from '../../types/shipment';
import { WebhookEventManager } from '../webhook/events';
import { EmailService } from '../email/email-service';

export class MockTrackingProvider implements TrackingProvider {
  private subscribers: Map<string, ((update: TrackingUpdate) => void)[]> = new Map();
  private updateIntervals: Map<string, NodeJS.Timeout> = new Map();
  private currentStatus: Map<string, ShipmentStatus> = new Map();
  
  constructor(
    private emailService: EmailService,
    private webhookManager: WebhookEventManager
  ) {}

  private getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private getNextStatus(current: ShipmentStatus): ShipmentStatus {
    const statusFlow: ShipmentStatus[] = [
      'pending',
      'picked_up',
      'in_transit',
      'out_for_delivery',
      'delivered'
    ];

    const currentIndex = statusFlow.indexOf(current);
    if (currentIndex === -1 || currentIndex === statusFlow.length - 1) {
      return current;
    }

    // 10% chance of an exception
    if (Math.random() < 0.1) {
      return 'exception';
    }

    return statusFlow[currentIndex + 1];
  }

  private createUpdate(trackingNumber: string, status: ShipmentStatus): TrackingUpdate {
    return {
      trackingNumber,
      status,
      location: this.getRandomElement(locations),
      timestamp: new Date(),
      description: this.getRandomElement(statusDescriptions[status])
    };
  }

  async getShipmentUpdates(trackingNumber: string): Promise<TrackingEvent[]> {
    const status = this.currentStatus.get(trackingNumber) || 'pending';
    const update = this.createUpdate(trackingNumber, status);
    
    return [{
      status: update.status,
      location: update.location,
      description: update.description,
      timestamp: update.timestamp
    }];
  }

  subscribeToUpdates(trackingNumber: string, callback: (update: TrackingUpdate) => void): void {
    if (!this.subscribers.has(trackingNumber)) {
      this.subscribers.set(trackingNumber, []);
      this.currentStatus.set(trackingNumber, 'pending');
    }

    this.subscribers.get(trackingNumber)?.push(callback);

    // Start sending updates if not already doing so
    if (!this.updateIntervals.has(trackingNumber)) {
      const interval = setInterval(() => {
        const currentStatus = this.currentStatus.get(trackingNumber) as ShipmentStatus;
        const nextStatus = this.getNextStatus(currentStatus);
        const update = this.createUpdate(trackingNumber, nextStatus);

        this.currentStatus.set(trackingNumber, nextStatus);
        this.subscribers.get(trackingNumber)?.forEach(cb => cb(update));

        // Send email notification
        this.emailService.sendShipmentUpdate(
          'customer@example.com',
          {
            trackingNumber: update.trackingNumber,
            status: update.status,
            location: `${update.location.city}, ${update.location.country}`,
            timestamp: update.timestamp
          }
        );

        // Send webhook event
        if (nextStatus === 'delivered') {
          this.clearUpdateInterval(trackingNumber);
        }
      }, 30000); // Update every 30 seconds

      this.updateIntervals.set(trackingNumber, interval);
    }
  }

  unsubscribeFromUpdates(trackingNumber: string): void {
    this.clearUpdateInterval(trackingNumber);
    this.subscribers.delete(trackingNumber);
    this.currentStatus.delete(trackingNumber);
  }

  private clearUpdateInterval(trackingNumber: string): void {
    const interval = this.updateIntervals.get(trackingNumber);
    if (interval) {
      clearInterval(interval);
      this.updateIntervals.delete(trackingNumber);
    }
  }
}