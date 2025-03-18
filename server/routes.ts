import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  app.get("/api/health-cards", async (_req, res) => {
    const cards = await storage.getHealthCards();
    res.json(cards);
  });

  app.get("/api/partners", async (_req, res) => {
    const partners = await storage.getPartners();
    res.json(partners);
  });

  app.get("/api/user-cards", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }
    const cards = await storage.getUserCards(req.user.id);
    res.json(cards);
  });

  app.post("/api/apply-card/:cardId", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }
    const cardId = parseInt(req.params.cardId);
    const userCard = await storage.applyForCard(req.user.id, cardId);
    res.json(userCard);
  });

  const httpServer = createServer(app);
  return httpServer;
}
