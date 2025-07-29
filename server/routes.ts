import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertNewsletterSchema, 
  insertDemoRequestSchema, 
  insertContactMessageSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Newsletter subscription endpoint
  app.post("/api/newsletter", async (req, res) => {
    try {
      const result = insertNewsletterSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid email format" });
      }

      // Check if already subscribed
      const existingSubscription = await storage.getNewsletterSubscription(result.data.email);
      if (existingSubscription) {
        if (existingSubscription.isActive) {
          return res.status(409).json({ error: "Already subscribed" });
        } else {
          // Reactivate subscription
          await storage.subscribeToNewsletter(result.data);
          return res.status(200).json({ message: "Subscription reactivated" });
        }
      }

      const subscription = await storage.subscribeToNewsletter(result.data);
      res.status(201).json({ message: "Successfully subscribed to newsletter", id: subscription.id });
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      res.status(500).json({ error: "Failed to subscribe" });
    }
  });

  // Demo request endpoint
  app.post("/api/demo", async (req, res) => {
    try {
      const result = insertDemoRequestSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid demo request data", details: result.error });
      }

      const demoRequest = await storage.createDemoRequest(result.data);
      res.status(201).json({ 
        message: "Demo request submitted successfully", 
        id: demoRequest.id 
      });
    } catch (error) {
      console.error("Demo request error:", error);
      res.status(500).json({ error: "Failed to submit demo request" });
    }
  });

  // Contact message endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const result = insertContactMessageSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid contact data", details: result.error });
      }

      const contactMessage = await storage.createContactMessage(result.data);
      res.status(201).json({ 
        message: "Message sent successfully", 
        id: contactMessage.id 
      });
    } catch (error) {
      console.error("Contact message error:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  // User registration endpoint
  app.post("/api/register", async (req, res) => {
    try {
      const result = insertUserSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid user data", details: result.error });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(result.data.email);
      if (existingUser) {
        return res.status(409).json({ error: "User already exists" });
      }

      const user = await storage.createUser(result.data);
      // Don't return password in response
      const { password, ...userResponse } = user;
      res.status(201).json({ message: "User created successfully", user: userResponse });
    } catch (error) {
      console.error("User registration error:", error);
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  // Get demo requests (admin endpoint)
  app.get("/api/admin/demo-requests", async (req, res) => {
    try {
      const demoRequests = await storage.getDemoRequests();
      res.status(200).json(demoRequests);
    } catch (error) {
      console.error("Get demo requests error:", error);
      res.status(500).json({ error: "Failed to get demo requests" });
    }
  });

  // Get contact messages (admin endpoint)
  app.get("/api/admin/contact-messages", async (req, res) => {
    try {
      const contactMessages = await storage.getContactMessages();
      res.status(200).json(contactMessages);
    } catch (error) {
      console.error("Get contact messages error:", error);
      res.status(500).json({ error: "Failed to get contact messages" });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);

  return httpServer;
}
