import { AnalyticsEvent, AnalyticsConfig } from '../types';

export class AnalyticsTracker {
  private config: AnalyticsConfig;
  private events: AnalyticsEvent[] = [];

  constructor(config: AnalyticsConfig) {
    this.config = config;
  }

  track(event: Omit<AnalyticsEvent, 'timestamp'>): void {
    if (!this.config.enabled) return;

    const fullEvent: AnalyticsEvent = {
      ...event,
      timestamp: Date.now(),
    };

    this.events.push(fullEvent);

    // Call custom event handler
    if (this.config.onEvent) {
      this.config.onEvent(fullEvent);
    }

    // Send to analytics provider
    this.sendToProvider(fullEvent);
  }

  private sendToProvider(event: AnalyticsEvent): void {
    if (!this.config.provider) return;

    switch (this.config.provider) {
      case 'google':
        this.sendToGoogleAnalytics(event);
        break;
      case 'segment':
        this.sendToSegment(event);
        break;
      case 'mixpanel':
        this.sendToMixpanel(event);
        break;
      case 'custom':
        // Custom provider handled via onEvent callback
        break;
    }
  }

  private sendToGoogleAnalytics(event: AnalyticsEvent): void {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event.type, {
        event_category: 'form',
        event_label: event.formId,
        form_id: event.formId,
        step_id: event.stepId,
        field_id: event.fieldId,
        ...event.metadata,
      });
    }
  }

  private sendToSegment(event: AnalyticsEvent): void {
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track(`Form ${event.type}`, {
        formId: event.formId,
        stepId: event.stepId,
        fieldId: event.fieldId,
        ...event.metadata,
      });
    }
  }

  private sendToMixpanel(event: AnalyticsEvent): void {
    if (typeof window !== 'undefined' && (window as any).mixpanel) {
      (window as any).mixpanel.track(`Form ${event.type}`, {
        formId: event.formId,
        stepId: event.stepId,
        fieldId: event.fieldId,
        ...event.metadata,
      });
    }
  }

  trackFormView(formId: string, metadata?: Record<string, unknown>): void {
    if (this.config.trackViews) {
      this.track({ type: 'view', formId, metadata });
    }
  }

  trackFieldInteraction(formId: string, fieldId: string, metadata?: Record<string, unknown>): void {
    if (this.config.trackInteractions) {
      this.track({ type: 'interaction', formId, fieldId, metadata });
    }
  }

  trackFormCompletion(formId: string, metadata?: Record<string, unknown>): void {
    if (this.config.trackCompletions) {
      this.track({ type: 'completion', formId, metadata });
    }
  }

  trackFormError(formId: string, fieldId: string, metadata?: Record<string, unknown>): void {
    if (this.config.trackErrors) {
      this.track({ type: 'error', formId, fieldId, metadata });
    }
  }

  trackCustomEvent(formId: string, metadata: Record<string, unknown>): void {
    if (this.config.customEvents) {
      this.track({ type: 'custom', formId, metadata });
    }
  }

  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  clearEvents(): void {
    this.events = [];
  }
}
