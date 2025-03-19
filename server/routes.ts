import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import Razorpay from "razorpay";

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error('Missing required Razorpay credentials');
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

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

  app.post("/api/create-payment", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    const { cardId } = req.body;
    const card = await storage.getHealthCard(cardId);

    if (!card) {
      return res.status(404).send("Card not found");
    }

    const options = {
      amount: card.monthlyPremium * 100, // amount in smallest currency unit (paise)
      currency: "INR",
      receipt: `card_application_${Date.now()}`,
      notes: {
        cardId: cardId,
        userId: req.user.id
      }
    };

    try {
      const order = await razorpay.orders.create(options);
      res.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID
      });
    } catch (error) {
      console.error('Razorpay order creation failed:', error);
      res.status(500).send("Payment initialization failed");
    }
  });

  app.post("/api/verify-payment", async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // Payment is verified, create the user card
      const order = await razorpay.orders.fetch(razorpay_order_id);
      const userCard = await storage.applyForCard(
        parseInt(order.notes.userId),
        parseInt(order.notes.cardId)
      );
      res.json(userCard);
    } else {
      res.status(400).send("Invalid signature");
    }
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