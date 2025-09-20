import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { GoogleGenerativeAI } from "@google/generative-ai";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Initialize Google GenAI (API key should be set in environment)
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY || "");

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(409).json({ error: "Username already exists" });
      }
      const newUser = await storage.createUser({ username, password });
      res.status(201).json({ id: newUser.id, username: newUser.username });
    } catch (error) {
      res.status(500).json({ error: "Failed to register user" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }
      const user = await storage.validateUserPassword(username, password);
      if (!user) {
        return res.status(401).json({ error: "Invalid username or password" });
      }
      const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });
      res.json({ token, user: { id: user.id, username: user.username } });
    } catch (error) {
      res.status(500).json({ error: "Failed to login" });
    }
  });

  app.get("/api/auth/user", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ error: "Authorization header missing" });
      }
      const token = authHeader.split(" ")[1];
      if (!token) {
        return res.status(401).json({ error: "Token missing" });
      }
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; username: string };
      const user = await storage.getUser(decoded.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ id: user.id, username: user.username });
    } catch (error) {
      res.status(401).json({ error: "Invalid or expired token" });
    }
  });

  // Middleware to protect routes
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Authorization header missing" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Token missing" });
    }
    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) {
        return res.status(403).json({ error: "Invalid or expired token" });
      }
      req.user = user;
      next();
    });
  };

  // Example of protecting a route
  app.get("/api/protected", authenticateToken, (req: any, res) => {
    res.json({ message: "This is a protected route", user: req.user });
  });

  // Existing routes below can be updated to use authenticateToken middleware as needed

  // Mood routes
  app.get("/api/moods/:userId", authenticateToken, async (req: any, res) => {
    try {
      if (req.user.userId !== req.params.userId) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const moods = await storage.getMoods(req.params.userId);
      res.json(moods);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch moods" });
    }
  });

  app.post("/api/moods", authenticateToken, async (req: any, res) => {
    try {
      if (req.user.userId !== req.body.userId) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const mood = await storage.addMood(req.body);
      res.json(mood);
    } catch (error) {
      res.status(500).json({ error: "Failed to add mood" });
    }
  });

  app.put("/api/moods/:id", authenticateToken, async (req: any, res) => {
    try {
      const mood = await storage.updateMood(parseInt(req.params.id), req.body);
      if (!mood) {
        return res.status(404).json({ error: "Mood not found" });
      }
      if (req.user.userId !== mood.userId) {
        return res.status(403).json({ error: "Forbidden" });
      }
      res.json(mood);
    } catch (error) {
      res.status(500).json({ error: "Failed to update mood" });
    }
  });

  app.delete("/api/moods/:id", authenticateToken, async (req: any, res) => {
    try {
      const mood = await storage.getMoods(req.user.userId);
      const moodToDelete = mood.find(m => m.id === parseInt(req.params.id));
      if (!moodToDelete) {
        return res.status(404).json({ error: "Mood not found" });
      }
      if (req.user.userId !== moodToDelete.userId) {
        return res.status(403).json({ error: "Forbidden" });
      }
      await storage.deleteMood(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete mood" });
    }
  });

  // Journal routes
  app.get("/api/journals/:userId", authenticateToken, async (req: any, res) => {
    try {
      if (req.user.userId !== req.params.userId) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const journals = await storage.getJournals(req.params.userId);
      res.json(journals);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch journals" });
    }
  });

  app.post("/api/journals", authenticateToken, async (req: any, res) => {
    try {
      if (req.user.userId !== req.body.userId) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const journal = await storage.addJournal(req.body);
      res.json(journal);
    } catch (error) {
      res.status(500).json({ error: "Failed to add journal" });
    }
  });

  app.put("/api/journals/:id", authenticateToken, async (req: any, res) => {
    try {
      const journal = await storage.updateJournal(parseInt(req.params.id), req.body);
      if (!journal) {
        return res.status(404).json({ error: "Journal not found" });
      }
      if (req.user.userId !== journal.userId) {
        return res.status(403).json({ error: "Forbidden" });
      }
      res.json(journal);
    } catch (error) {
      res.status(500).json({ error: "Failed to update journal" });
    }
  });

  app.delete("/api/journals/:id", authenticateToken, async (req: any, res) => {
    try {
      const journal = await storage.getJournals(req.user.userId);
      const journalToDelete = journal.find(j => j.id === parseInt(req.params.id));
      if (!journalToDelete) {
        return res.status(404).json({ error: "Journal not found" });
      }
      if (req.user.userId !== journalToDelete.userId) {
        return res.status(403).json({ error: "Forbidden" });
      }
      await storage.deleteJournal(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete journal" });
    }
  });

  // Streak routes
  app.get("/api/streaks/:userId", authenticateToken, async (req: any, res) => {
    try {
      if (req.user.userId !== req.params.userId) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const streaks = await storage.getStreaks(req.params.userId);
      res.json(streaks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch streaks" });
    }
  });

  app.post("/api/streaks", authenticateToken, async (req: any, res) => {
    try {
      if (req.user.userId !== req.body.userId) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const streak = await storage.addStreak(req.body);
      res.json(streak);
    } catch (error) {
      res.status(500).json({ error: "Failed to add streak" });
    }
  });

  app.put("/api/streaks/:id", authenticateToken, async (req: any, res) => {
    try {
      const streak = await storage.updateStreak(parseInt(req.params.id), req.body);
      if (!streak) {
        return res.status(404).json({ error: "Streak not found" });
      }
      if (req.user.userId !== streak.userId) {
        return res.status(403).json({ error: "Forbidden" });
      }
      res.json(streak);
    } catch (error) {
      res.status(500).json({ error: "Failed to update streak" });
    }
  });

  // Badge routes
  app.get("/api/badges/:userId", authenticateToken, async (req: any, res) => {
    try {
      if (req.user.userId !== req.params.userId) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const badges = await storage.getBadges(req.params.userId);
      res.json(badges);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch badges" });
    }
  });

  app.post("/api/badges", authenticateToken, async (req: any, res) => {
    try {
      if (req.user.userId !== req.body.userId) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const badge = await storage.addBadge(req.body);
      res.json(badge);
    } catch (error) {
      res.status(500).json({ error: "Failed to add badge" });
    }
  });

  // Reminder routes
  app.get("/api/reminders/:userId", authenticateToken, async (req: any, res) => {
    try {
      if (req.user.userId !== req.params.userId) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const reminders = await storage.getReminders(req.params.userId);
      res.json(reminders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reminders" });
    }
  });

  app.post("/api/reminders", authenticateToken, async (req: any, res) => {
    try {
      if (req.user.userId !== req.body.userId) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const reminder = await storage.addReminder(req.body);
      res.json(reminder);
    } catch (error) {
      res.status(500).json({ error: "Failed to update reminder" });
    }
  });

  app.put("/api/reminders/:id", authenticateToken, async (req: any, res) => {
    try {
      const reminder = await storage.updateReminder(parseInt(req.params.id), req.body);
      if (!reminder) {
        return res.status(404).json({ error: "Reminder not found" });
      }
      if (req.user.userId !== reminder.userId) {
        return res.status(403).json({ error: "Forbidden" });
      }
      res.json(reminder);
    } catch (error) {
      res.status(500).json({ error: "Failed to update reminder" });
    }
  });

  app.delete("/api/reminders/:id", authenticateToken, async (req: any, res) => {
    try {
      const reminder = await storage.getReminders(req.user.userId);
      const reminderToDelete = reminder.find(r => r.id === parseInt(req.params.id));
      if (!reminderToDelete) {
        return res.status(404).json({ error: "Reminder not found" });
      }
      if (req.user.userId !== reminderToDelete.userId) {
        return res.status(403).json({ error: "Forbidden" });
      }
      await storage.deleteReminder(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete reminder" });
    }
  });

  // AI Chat route
  app.post("/api/chat", authenticateToken, async (req: any, res) => {
    try {
      const { message } = req.body;
      const userId = req.user.userId;

      // Crisis detection keywords
      const crisisKeywords = [
        'suicide', 'kill myself', 'end it all', 'not worth living',
        'self harm', 'cutting', 'overdose', 'jump', 'hang myself',
        'want to die', 'better off dead', 'no reason to live'
      ];

      const lowerMessage = message.toLowerCase();
      const hasCrisisKeyword = crisisKeywords.some(keyword =>
        lowerMessage.includes(keyword)
      );

      if (hasCrisisKeyword) {
        return res.json({
          response: "I'm really concerned about what you're saying. Your safety is the most important thing right now. Please reach out to a crisis helpline immediately. In India, you can call AASRA at 91-9820466726 or Vandrevala Foundation at 1860-2662-345. You're not alone, and help is available 24/7.",
          crisisDetected: true
        });
      }

      // Use Google GenAI for normal responses
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const prompt = `You are a compassionate AI wellness companion for Indian youth. Respond empathetically and supportively to: "${message}"

Guidelines:
- Be culturally sensitive to Indian context
- Encourage healthy coping strategies
- Suggest professional help when appropriate
- Keep responses concise but caring
- Focus on emotional support and practical advice
- Never give medical or therapeutic advice

Respond as a supportive friend who cares deeply about their well-being.`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const aiMessage = response.text();

      res.json({
        response: aiMessage,
        crisisDetected: false
      });
    } catch (error) {
      console.error("AI Chat error:", error);
      res.status(500).json({
        response: "I'm here for you. Sometimes technology has hiccups, but I'm still listening. How are you feeling right now?",
        crisisDetected: false
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
