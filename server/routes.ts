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

  // Trading API Endpoints

  // Mock stock data
  const mockStockData = [
    { symbol: 'AAPL', price: 185.42, change: 4.23, changePercent: 2.34, signal: 'BUY', confidence: 94, volume: 45234567 },
    { symbol: 'TSLA', price: 248.91, change: -2.15, changePercent: -0.86, signal: 'HOLD', confidence: 67, volume: 32145678 },
    { symbol: 'NVDA', price: 421.33, change: 12.87, changePercent: 3.15, signal: 'BUY', confidence: 89, volume: 28765432 },
    { symbol: 'MSFT', price: 378.12, change: 6.45, changePercent: 1.73, signal: 'BUY', confidence: 82, volume: 19876543 },
    { symbol: 'GOOGL', price: 142.56, change: -1.23, changePercent: -0.85, signal: 'SELL', confidence: 76, volume: 15432109 },
    { symbol: 'AMZN', price: 156.78, change: 3.21, changePercent: 2.09, signal: 'BUY', confidence: 88, volume: 22345678 },
    { symbol: 'META', price: 298.45, change: -5.67, changePercent: -1.86, signal: 'SELL', confidence: 79, volume: 18765432 },
    { symbol: 'NFLX', price: 445.23, change: 8.91, changePercent: 2.04, signal: 'BUY', confidence: 85, volume: 12345678 }
  ];

  const mockAlerts = [
    {
      id: '1',
      symbol: 'AAPL',
      type: 'BUY_SIGNAL',
      message: 'Strong bullish momentum detected across all timeframes',
      confidence: 94,
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      targetPrice: 195.50,
      stopLoss: 180.25
    },
    {
      id: '2',
      symbol: 'NVDA',
      type: 'BREAKOUT',
      message: 'Price breaking above key resistance level',
      confidence: 89,
      timestamp: new Date(Date.now() - 12 * 60 * 1000),
      targetPrice: 445.00,
      stopLoss: 410.00
    },
    {
      id: '3',
      symbol: 'MSFT',
      type: 'VOLUME_SPIKE',
      message: 'Unusual volume spike with bullish price action',
      confidence: 82,
      timestamp: new Date(Date.now() - 18 * 60 * 1000),
      targetPrice: 390.00,
      stopLoss: 370.00
    }
  ];

  // GET /api/stocks - Get current stock data with signals
  app.get("/api/stocks", (req, res) => {
    try {
      const updatedStocks = mockStockData.map(stock => ({
        ...stock,
        price: stock.price + (Math.random() - 0.5) * 2,
        change: stock.change + (Math.random() - 0.5) * 0.5,
        changePercent: stock.changePercent + (Math.random() - 0.5) * 0.2,
        confidence: Math.max(60, Math.min(99, stock.confidence + (Math.random() - 0.5) * 5)),
        lastUpdated: new Date()
      }));

      res.json({
        success: true,
        data: updatedStocks,
        timestamp: new Date()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch stock data'
      });
    }
  });

  // GET /api/alerts - Get recent trading alerts
  app.get("/api/alerts", (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const alerts = mockAlerts.slice(0, limit);

      res.json({
        success: true,
        data: alerts,
        total: mockAlerts.length,
        timestamp: new Date()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch alerts'
      });
    }
  });

  // GET /api/market-status - Get current market status
  app.get("/api/market-status", (req, res) => {
    try {
      const now = new Date();
      const hour = now.getHours();
      const day = now.getDay();

      let status = 'CLOSED';
      let nextOpen = 'Monday 9:30 AM EST';

      if (day >= 1 && day <= 5) {
        if (hour >= 4 && hour < 9.5) {
          status = 'PRE_MARKET';
          nextOpen = 'Today 9:30 AM EST';
        } else if (hour >= 9.5 && hour < 16) {
          status = 'OPEN';
          nextOpen = 'Tomorrow 9:30 AM EST';
        } else if (hour >= 16 && hour < 20) {
          status = 'AFTER_HOURS';
          nextOpen = 'Tomorrow 9:30 AM EST';
        }
      }

      res.json({
        success: true,
        data: {
          status,
          nextOpen,
          currentTime: now,
          timezone: 'EST',
          isWeekend: day === 0 || day === 6
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch market status'
      });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);

  return httpServer;
}
