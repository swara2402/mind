import { type User, type InsertUser, type Mood, type InsertMood, type Journal, type InsertJournal, type Streak, type InsertStreak, type Badge, type InsertBadge, type Reminder, type InsertReminder } from "@shared/schema";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

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

export class SupabaseStorage implements IStorage {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase URL or API key");
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async getUser(id: string): Promise<User | undefined> {
    const { data, error } = await this.supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching user:", error);
      return undefined;
    }

    return data;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { data, error } = await this.supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .single();

    if (error) {
      console.error("Error fetching user by username:", error);
      return undefined;
    }

    return data;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const { data, error } = await this.supabase
      .from("users")
      .insert({ ...insertUser, password: hashedPassword })
      .select()
      .single();

    if (error) {
      console.error("Error creating user:", error);
      throw new Error("Failed to create user");
    }

    return data;
  }

  async validateUserPassword(username: string, password: string): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  // Mood methods
  async getMoods(userId: string): Promise<Mood[]> {
    const { data, error } = await this.supabase
      .from("moods")
      .select("*")
      .eq("userId", userId)
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching moods:", error);
      return [];
    }

    return data || [];
  }

  async addMood(mood: InsertMood): Promise<Mood> {
    const { data, error } = await this.supabase
      .from("moods")
      .insert(mood)
      .select()
      .single();

    if (error) {
      console.error("Error adding mood:", error);
      throw new Error("Failed to add mood");
    }

    return data;
  }

  async updateMood(id: number, mood: Partial<InsertMood>): Promise<Mood | undefined> {
    const { data, error } = await this.supabase
      .from("moods")
      .update(mood)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating mood:", error);
      return undefined;
    }

    return data;
  }

  async deleteMood(id: number): Promise<void> {
    const { error } = await this.supabase
      .from("moods")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting mood:", error);
      throw new Error("Failed to delete mood");
    }
  }

  // Journal methods
  async getJournals(userId: string): Promise<Journal[]> {
    const { data, error } = await this.supabase
      .from("journals")
      .select("*")
      .eq("userId", userId)
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching journals:", error);
      return [];
    }

    return data || [];
  }

  async addJournal(journal: InsertJournal): Promise<Journal> {
    const { data, error } = await this.supabase
      .from("journals")
      .insert(journal)
      .select()
      .single();

    if (error) {
      console.error("Error adding journal:", error);
      throw new Error("Failed to add journal");
    }

    return data;
  }

  async updateJournal(id: number, journal: Partial<InsertJournal>): Promise<Journal | undefined> {
    const { data, error } = await this.supabase
      .from("journals")
      .update(journal)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating journal:", error);
      return undefined;
    }

    return data;
  }

  async deleteJournal(id: number): Promise<void> {
    const { error } = await this.supabase
      .from("journals")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting journal:", error);
      throw new Error("Failed to delete journal");
    }
  }

  // Streak methods
  async getStreaks(userId: string): Promise<Streak[]> {
    const { data, error } = await this.supabase
      .from("streaks")
      .select("*")
      .eq("userId", userId);

    if (error) {
      console.error("Error fetching streaks:", error);
      return [];
    }

    return data || [];
  }

  async addStreak(streak: InsertStreak): Promise<Streak> {
    const { data, error } = await this.supabase
      .from("streaks")
      .insert(streak)
      .select()
      .single();

    if (error) {
      console.error("Error adding streak:", error);
      throw new Error("Failed to add streak");
    }

    return data;
  }

  async updateStreak(id: number, streak: Partial<InsertStreak>): Promise<Streak | undefined> {
    const { data, error } = await this.supabase
      .from("streaks")
      .update(streak)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating streak:", error);
      return undefined;
    }

    return data;
  }

  // Badge methods
  async getBadges(userId: string): Promise<Badge[]> {
    const { data, error } = await this.supabase
      .from("badges")
      .select("*")
      .eq("userId", userId)
      .order("earnedDate", { ascending: false });

    if (error) {
      console.error("Error fetching badges:", error);
      return [];
    }

    return data || [];
  }

  async addBadge(badge: InsertBadge): Promise<Badge> {
    const { data, error } = await this.supabase
      .from("badges")
      .insert(badge)
      .select()
      .single();

    if (error) {
      console.error("Error adding badge:", error);
      throw new Error("Failed to add badge");
    }

    return data;
  }

  // Reminder methods
  async getReminders(userId: string): Promise<Reminder[]> {
    const { data, error } = await this.supabase
      .from("reminders")
      .select("*")
      .eq("userId", userId)
      .eq("isActive", true)
      .order("scheduledTime", { ascending: true });

    if (error) {
      console.error("Error fetching reminders:", error);
      return [];
    }

    return data || [];
  }

  async addReminder(reminder: InsertReminder): Promise<Reminder> {
    const { data, error } = await this.supabase
      .from("reminders")
      .insert(reminder)
      .select()
      .single();

    if (error) {
      console.error("Error adding reminder:", error);
      throw new Error("Failed to add reminder");
    }

    return data;
  }

  async updateReminder(id: number, reminder: Partial<InsertReminder>): Promise<Reminder | undefined> {
    const { data, error } = await this.supabase
      .from("reminders")
      .update(reminder)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating reminder:", error);
      return undefined;
    }

    return data;
  }

  async deleteReminder(id: number): Promise<void> {
    const { error } = await this.supabase
      .from("reminders")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting reminder:", error);
      throw new Error("Failed to delete reminder");
    }
  }
}

export const storage = new SupabaseStorage();
