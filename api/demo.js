import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { z } from 'zod';

// Configure WebSocket for serverless
if (typeof WebSocket === 'undefined') {
  const ws = require('ws');
  neonConfig.webSocketConstructor = ws;
}

// Define demo requests schema
const demoRequests = pgTable("demo_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull(),
  fullName: text("full_name").notNull(),
  company: text("company"),
  phone: text("phone"),
  message: text("message"),
  requestedAt: timestamp("requested_at").notNull().default(sql`now()`),
  status: text("status").notNull().default("pending"),
});

// Validation schema
const insertDemoRequestSchema = z.object({
  email: z.string().email("Invalid email format"),
  fullName: z.string().min(1, "Full name is required"),
  company: z.string().optional(),
  phone: z.string().optional(),
  message: z.string().optional(),
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate input
    const result = insertDemoRequestSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ 
        error: "Invalid demo request data", 
        details: result.error.errors 
      });
    }

    // Check if database is available
    if (!process.env.DATABASE_URL) {
      return res.status(503).json({ 
        error: "Database not configured. Demo requests temporarily unavailable." 
      });
    }

    // Initialize database connection
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const db = drizzle(pool);

    // Create demo request
    const newDemoRequest = await db
      .insert(demoRequests)
      .values(result.data)
      .returning();

    res.status(201).json({ 
      message: "Demo request submitted successfully", 
      id: newDemoRequest[0].id 
    });

  } catch (error) {
    console.error("Demo request error:", error);
    res.status(500).json({ error: "Failed to submit demo request" });
  }
}
