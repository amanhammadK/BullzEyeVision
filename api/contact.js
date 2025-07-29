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

// Define contact messages schema
const contactMessages = pgTable("contact_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull(),
  fullName: text("full_name").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  status: text("status").notNull().default("new"),
});

// Validation schema
const insertContactMessageSchema = z.object({
  email: z.string().email("Invalid email format"),
  fullName: z.string().min(1, "Full name is required"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate input
    const result = insertContactMessageSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ 
        error: "Invalid contact data", 
        details: result.error.errors 
      });
    }

    // Check if database is available
    if (!process.env.DATABASE_URL) {
      return res.status(503).json({ 
        error: "Database not configured. Contact form temporarily unavailable." 
      });
    }

    // Initialize database connection
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const db = drizzle(pool);

    // Create contact message
    const newContactMessage = await db
      .insert(contactMessages)
      .values(result.data)
      .returning();

    res.status(201).json({ 
      message: "Message sent successfully", 
      id: newContactMessage[0].id 
    });

  } catch (error) {
    console.error("Contact message error:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
}
