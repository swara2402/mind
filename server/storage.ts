import { type User, type InsertUser, type Mood, type InsertMood, type Journal, type InsertJournal, type Streak, type InsertStreak, type Badge, type InsertBadge, type Reminder, type InsertReminder } from "@shared/schema";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  validateUserPassword(username: string, password: string): Promise<User | null>;

  // Mood methods
  getMoods(userId: string): Promise<Mood[]>;
  addMood(mood: InsertMood): Promise<Mood>;
  updateMood(id: number, mood: Partial<InsertMood>): Promise<Mood | undefined>;
  deleteMood(id: number): Promise<void>;

  // Journal methods
  getJournals(userId: string): Promise<Journal[]>;
  addJournal(journal: InsertJournal): Promise<Journal>;
  updateJournal(id: number, journal: Partial<InsertJournal>): Promise<Journal | undefined>;
  deleteJournal(id: number): Promise<void>;

  // Streak methods
  getStreaks(userId: string): Promise<Streak[]>;
  addStreak(streak: InsertStreak): Promise<Streak>;
  updateStreak(id: number, streak: Partial<InsertStreak>): Promise<Streak | undefined>;

  // Badge methods
  getBadges(userId: string): Promise<Badge[]>;
  addBadge(badge: InsertBadge): Promise<Badge>;

  // Reminder methods
  getReminders(userId: string): Promise<Reminder[]>;
  addReminder(reminder: InsertReminder): Promise<Reminder>;
  updateReminder(id: number, reminder: Partial<InsertReminder>): Promise<Reminder | undefined>;
  deleteReminder(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private moods: Map<number, Mood>;
  private journals: Map<number, Journal>;
  private streaks: Map<number, Streak>;
  private badges: Map<number, Badge>;
  private reminders: Map<number, Reminder>;

  constructor() {
    this.users = new Map();
    this.moods = new Map();
    this.journals = new Map();
    this.streaks = new Map();
    this.badges = new Map();
    this.reminders = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const user: User = { ...insertUser, id, password: hashedPassword };
    this.users.set(id, user);
    return user;
  }

  async validateUserPassword(username: string, password: string): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    if (!user) return null;
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  // Mood methods
  async getMoods(userId: string): Promise<Mood[]> {
    return Array.from(this.moods.values()).filter(m => m.userId === userId);
  }

  async addMood(mood: InsertMood): Promise<Mood> {
    const id = this.moods.size + 1;
    const newMood: Mood = {
      ...mood,
      id,
      date: new Date(),
      createdAt: new Date(),
      userId: mood.userId || null,
      notes: mood.notes || null
    };
    this.moods.set(id, newMood);
    return newMood;
  }

  async updateMood(id: number, mood: Partial<InsertMood>): Promise<Mood | undefined> {
    const existing = this.moods.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...mood };
    this.moods.set(id, updated);
    return updated;
  }

  async deleteMood(id: number): Promise<void> {
    this.moods.delete(id);
  }

  // Journal methods
  async getJournals(userId: string): Promise<Journal[]> {
    return Array.from(this.journals.values()).filter(j => j.userId === userId);
  }

  async addJournal(journal: InsertJournal): Promise<Journal> {
    const id = this.journals.size + 1;
    const newJournal: Journal = {
      ...journal,
      id,
      date: new Date(),
      createdAt: new Date(),
      userId: journal.userId || null,
      prompt: journal.prompt || null
    };
    this.journals.set(id, newJournal);
    return newJournal;
  }

  async updateJournal(id: number, journal: Partial<InsertJournal>): Promise<Journal | undefined> {
    const existing = this.journals.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...journal };
    this.journals.set(id, updated);
    return updated;
  }

  async deleteJournal(id: number): Promise<void> {
    this.journals.delete(id);
  }

  // Streak methods
  async getStreaks(userId: string): Promise<Streak[]> {
    return Array.from(this.streaks.values()).filter(s => s.userId === userId);
  }

  async addStreak(streak: InsertStreak): Promise<Streak> {
    const id = this.streaks.size + 1;
    const newStreak: Streak = {
      ...streak,
      id,
      userId: streak.userId || null,
      currentStreak: 0,
      longestStreak: 0,
      lastActivity: null
    };
    this.streaks.set(id, newStreak);
    return newStreak;
  }

  async updateStreak(id: number, streak: Partial<InsertStreak>): Promise<Streak | undefined> {
    const existing = this.streaks.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...streak };
    this.streaks.set(id, updated);
    return updated;
  }

  // Badge methods
  async getBadges(userId: string): Promise<Badge[]> {
    return Array.from(this.badges.values()).filter(b => b.userId === userId);
  }

  async addBadge(badge: InsertBadge): Promise<Badge> {
    const id = this.badges.size + 1;
    const newBadge: Badge = {
      ...badge,
      id,
      userId: badge.userId || null,
      earnedDate: new Date()
    };
    this.badges.set(id, newBadge);
    return newBadge;
  }

  // Reminder methods
  async getReminders(userId: string): Promise<Reminder[]> {
    return Array.from(this.reminders.values()).filter(r => r.userId === userId);
  }

  async addReminder(reminder: InsertReminder): Promise<Reminder> {
    const id = this.reminders.size + 1;
    const newReminder: Reminder = {
      ...reminder,
      id,
      userId: reminder.userId || null,
      description: reminder.description || null,
      recurring: reminder.recurring || false,
      recurringType: reminder.recurringType || null,
      isActive: true,
      createdAt: new Date()
    };
    this.reminders.set(id, newReminder);
    return newReminder;
  }

  async updateReminder(id: number, reminder: Partial<InsertReminder>): Promise<Reminder | undefined> {
    const existing = this.reminders.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...reminder };
    this.reminders.set(id, updated);
    return updated;
  }

  async deleteReminder(id: number): Promise<void> {
    this.reminders.delete(id);
  }
}

export const storage = new MemStorage();
