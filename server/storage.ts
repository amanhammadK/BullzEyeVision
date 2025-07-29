import { eq } from "drizzle-orm";
import { db } from "./db";
import {
  users,
  newsletters,
  demoRequests,
  contactMessages,
  type User,
  type InsertUser,
  type Newsletter,
  type InsertNewsletter,
  type DemoRequest,
  type InsertDemoRequest,
  type ContactMessage,
  type InsertContactMessage
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Newsletter methods
  getNewsletterSubscription(email: string): Promise<Newsletter | undefined>;
  subscribeToNewsletter(newsletter: InsertNewsletter): Promise<Newsletter>;

  // Demo request methods
  createDemoRequest(demoRequest: InsertDemoRequest): Promise<DemoRequest>;
  getDemoRequests(): Promise<DemoRequest[]>;

  // Contact message methods
  createContactMessage(contactMessage: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Newsletter methods
  async getNewsletterSubscription(email: string): Promise<Newsletter | undefined> {
    const result = await db.select().from(newsletters).where(eq(newsletters.email, email)).limit(1);
    return result[0];
  }

  async subscribeToNewsletter(newsletter: InsertNewsletter): Promise<Newsletter> {
    const result = await db.insert(newsletters).values(newsletter)
      .onConflictDoUpdate({
        target: newsletters.email,
        set: { isActive: true, subscribedAt: new Date() }
      })
      .returning();
    return result[0];
  }

  // Demo request methods
  async createDemoRequest(demoRequest: InsertDemoRequest): Promise<DemoRequest> {
    const result = await db.insert(demoRequests).values(demoRequest).returning();
    return result[0];
  }

  async getDemoRequests(): Promise<DemoRequest[]> {
    return await db.select().from(demoRequests).orderBy(demoRequests.requestedAt);
  }

  // Contact message methods
  async createContactMessage(contactMessage: InsertContactMessage): Promise<ContactMessage> {
    const result = await db.insert(contactMessages).values(contactMessage).returning();
    return result[0];
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return await db.select().from(contactMessages).orderBy(contactMessages.createdAt);
  }
}

export const storage = new DatabaseStorage();
