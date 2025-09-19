import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { supabase } from "./supabase";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // Test Supabase connectivity
  app.get("/api/test-supabase", async (req, res) => {
    try {
      const { data, error } = await supabase.from('users').select('count').limit(1);
      if (error) throw error;
      res.json({ message: "Supabase connected successfully", data });
    } catch (error) {
      res.status(500).json({ message: "Supabase connection failed", error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
