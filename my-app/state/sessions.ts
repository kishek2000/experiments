import { create } from "zustand";

export interface Session {
  id: string;
  duration: number; // in minutes
  startTime: Date;
  endTime: Date;
  feelings: string[];
  customFeeling?: string;
}

interface SessionState {
  sessions: Session[];
  addSession: (session: Session) => void;
  getSessions: () => Session[];
  getCurrentStreak: () => number;
  getLastMeditatedAt: () => Date | null;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  sessions: [],

  addSession: (session) => {
    set((state) => ({
      sessions: [...state.sessions, session],
    }));
  },

  getSessions: () => {
    return get().sessions.sort(
      (a, b) => b.startTime.getTime() - a.startTime.getTime()
    );
  },

  getCurrentStreak: () => {
    const sessions = get().sessions;
    if (sessions.length === 0) return 0;

    // Sort sessions by start time (most recent first)
    const sortedSessions = sessions.sort(
      (a, b) => b.startTime.getTime() - a.startTime.getTime()
    );

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const session of sortedSessions) {
      const sessionDate = new Date(session.startTime);
      sessionDate.setHours(0, 0, 0, 0);

      const daysDiff = Math.floor(
        (today.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff === streak) {
        streak++;
        today.setDate(today.getDate() - 1);
      } else if (daysDiff > streak) {
        break;
      }
    }

    return streak;
  },

  getLastMeditatedAt: () => {
    const sessions = get().sessions;
    if (sessions.length === 0) return null;

    const sortedSessions = sessions.sort(
      (a, b) => b.startTime.getTime() - a.startTime.getTime()
    );
    return sortedSessions[0].startTime;
  },
}));
