import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const moods = pgTable("moods", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  date: timestamp("date").notNull().default(sql`now()`),
  moodLevel: integer("mood_level").notNull(), // 1-5 scale
  notes: text("notes"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const journals = pgTable("journals", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  date: timestamp("date").notNull().default(sql`now()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  prompt: text("prompt"), // Optional journal prompt
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const streaks = pgTable("streaks", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  type: varchar("type").notNull(), // 'mood_tracking', 'journaling', 'mindfulness'
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  lastActivity: timestamp("last_activity"),
});

export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  badgeType: varchar("badge_type").notNull(), // 'first_mood', 'week_streak', etc.
  earnedDate: timestamp("earned_date").default(sql`now()`),
});

export const reminders = pgTable("reminders", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  scheduledTime: timestamp("scheduled_time").notNull(),
  recurring: boolean("recurring").default(false),
  recurringType: varchar("recurring_type"), // 'daily', 'weekly', 'monthly'
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertMoodSchema = createInsertSchema(moods).pick({
  userId: true,
  moodLevel: true,
  notes: true,
});

export const insertJournalSchema = createInsertSchema(journals).pick({
  userId: true,
  title: true,
  content: true,
  prompt: true,
});

export const insertStreakSchema = createInsertSchema(streaks).pick({
  userId: true,
  type: true,
});

export const insertBadgeSchema = createInsertSchema(badges).pick({
  userId: true,
  badgeType: true,
});

export const insertReminderSchema = createInsertSchema(reminders).pick({
  userId: true,
  title: true,
  description: true,
  scheduledTime: true,
  recurring: true,
  recurringType: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertMood = z.infer<typeof insertMoodSchema>;
export type Mood = typeof moods.$inferSelect;

export type InsertJournal = z.infer<typeof insertJournalSchema>;
export type Journal = typeof journals.$inferSelect;

export type InsertStreak = z.infer<typeof insertStreakSchema>;
export type Streak = typeof streaks.$inferSelect;

export type InsertBadge = z.infer<typeof insertBadgeSchema>;
export type Badge = typeof badges.$inferSelect;

export type InsertReminder = z.infer<typeof insertReminderSchema>;
export type Reminder = typeof reminders.$inferSelect;
