import { UserSessionRepository } from '.';

const initialStore: { [key: string]: string[] } = {};

class LocalUserSessionRepository implements UserSessionRepository {
  selectedEvents: typeof initialStore;

  constructor() {
    this.reset();
  }

  reset() {
    this.selectedEvents = initialStore;
  }

  async getSelectedEvents(userId: string, fixtureId: string) {
    return this.selectedEvents[`${fixtureId}-${userId}`] || [];
  }

  async getUsersPlayingFixture(fixtureId: string) {
    const userIds = Object.keys(this.selectedEvents)
      .map((fixtureIdUserId) => fixtureIdUserId.split('-'))
      .filter(([_fixtureId]) => _fixtureId === fixtureId)
      .map(([, userId]) => userId);
    return userIds;
  }

  async selectEvent(userId: string, fixtureId: string, selectedEvent: string) {
    this.selectedEvents[`${fixtureId}-${userId}`] = [
      ...(this.selectedEvents[`${fixtureId}-${userId}`] || []),
      selectedEvent,
    ];
  }

  async deselectEvent(
    userId: string,
    fixtureId: string,
    deselectedEvent: string
  ) {
    if (!this.selectedEvents[`${fixtureId}-${userId}`]) {
      return;
    }
    this.selectedEvents[`${fixtureId}-${userId}`] = this.selectedEvents[
      `${fixtureId}-${userId}`
    ].filter((eventName) => eventName !== deselectedEvent);
  }
}

export const userSessionRepository = new LocalUserSessionRepository();