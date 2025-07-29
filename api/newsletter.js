import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { pgTable, text, timestamp, boolean, varchar } from 'drizzle-orm/pg-core';
import { sql, eq } from 'drizzle-orm';
import { z } from 'zod';

// Configure WebSocket for serverless
if (typeof WebSocket === 'undefined') {
  const ws = require('ws');
  neonConfig.webSocketConstructor = ws;
}

// Define newsletter schema
const newsletters = pgTable("newsletters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  subscribedAt: timestamp("subscribed_at").notNull().default(sql`now()`),
  isActive: boolean("is_active").notNull().default(true),
});

// Validation schema
const insertNewsletterSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate input
    const result = insertNewsletterSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Check if database is available
    if (!process.env.DATABASE_URL) {
      return res.status(503).json({ 
        error: "Database not configured. Newsletter signup temporarily unavailable." 
      });
    }

    // Initialize database connection
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const db = drizzle(pool);

    // Check if already subscribed
    const existingSubscription = await db
      .select()
      .from(newsletters)
      .where(eq(newsletters.email, result.data.email))
      .limit(1);

    if (existingSubscription.length > 0) {
      const subscription = existingSubscription[0];
      if (subscription.isActive) {
        return res.status(409).json({ error: "Already subscribed" });
      } else {
        // Reactivate subscription
        await db
          .update(newsletters)
          .set({ isActive: true, subscribedAt: new Date() })
          .where(eq(newsletters.email, result.data.email));
        return res.status(200).json({ message: "Subscription reactivated" });
      }
    }

    // Create new subscription
    const newSubscription = await db
      .insert(newsletters)
      .values({ email: result.data.email })
      .returning();

    res.status(201).json({ 
      message: "Successfully subscribed to newsletter", 
      id: newSubscription[0].id 
    });

  } catch (error) {
    console.error("Newsletter subscription error:", error);
    res.status(500).json({ error: "Failed to subscribe" });
  }
}
