import { eq } from "drizzle-orm";
import { db } from "./db";
import { 
  users, urlScans, whoisLookups, fileHashes, savedPasswords, leakTests,
  type User, type InsertUser, type UrlScan, type InsertUrlScan,
  type WhoisLookup, type InsertWhoisLookup, type FileHash, type InsertFileHash,
  type SavedPassword, type InsertSavedPassword, type LeakTest, type InsertLeakTest
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // URL scan operations
  saveUrlScan(scan: InsertUrlScan): Promise<UrlScan>;
  getUrlScans(userId?: number): Promise<UrlScan[]>;
  
  // WHOIS lookup operations
  saveWhoisLookup(lookup: InsertWhoisLookup): Promise<WhoisLookup>;
  getWhoisLookups(userId?: number): Promise<WhoisLookup[]>;
  
  // File hash operations
  saveFileHash(hash: InsertFileHash): Promise<FileHash>;
  getFileHashes(userId?: number): Promise<FileHash[]>;
  
  // Password operations
  savePassword(password: InsertSavedPassword): Promise<SavedPassword>;
  getPasswords(userId?: number): Promise<SavedPassword[]>;
  
  // Leak test operations
  saveLeakTest(test: InsertLeakTest): Promise<LeakTest>;
  getLeakTests(userId?: number): Promise<LeakTest[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  // URL scan operations
  async saveUrlScan(scan: InsertUrlScan): Promise<UrlScan> {
    const [result] = await db
      .insert(urlScans)
      .values(scan)
      .returning();
    return result;
  }
  
  async getUrlScans(userId?: number): Promise<UrlScan[]> {
    if (userId) {
      return await db.select().from(urlScans).where(eq(urlScans.userId, userId));
    }
    return await db.select().from(urlScans);
  }
  
  // WHOIS lookup operations
  async saveWhoisLookup(lookup: InsertWhoisLookup): Promise<WhoisLookup> {
    const [result] = await db
      .insert(whoisLookups)
      .values(lookup)
      .returning();
    return result;
  }
  
  async getWhoisLookups(userId?: number): Promise<WhoisLookup[]> {
    if (userId) {
      return await db.select().from(whoisLookups).where(eq(whoisLookups.userId, userId));
    }
    return await db.select().from(whoisLookups);
  }
  
  // File hash operations
  async saveFileHash(hash: InsertFileHash): Promise<FileHash> {
    const [result] = await db
      .insert(fileHashes)
      .values(hash)
      .returning();
    return result;
  }
  
  async getFileHashes(userId?: number): Promise<FileHash[]> {
    if (userId) {
      return await db.select().from(fileHashes).where(eq(fileHashes.userId, userId));
    }
    return await db.select().from(fileHashes);
  }
  
  // Password operations
  async savePassword(password: InsertSavedPassword): Promise<SavedPassword> {
    const [result] = await db
      .insert(savedPasswords)
      .values(password)
      .returning();
    return result;
  }
  
  async getPasswords(userId?: number): Promise<SavedPassword[]> {
    if (userId) {
      return await db.select().from(savedPasswords).where(eq(savedPasswords.userId, userId));
    }
    return await db.select().from(savedPasswords);
  }
  
  // Leak test operations
  async saveLeakTest(test: InsertLeakTest): Promise<LeakTest> {
    const [result] = await db
      .insert(leakTests)
      .values(test)
      .returning();
    return result;
  }
  
  async getLeakTests(userId?: number): Promise<LeakTest[]> {
    if (userId) {
      return await db.select().from(leakTests).where(eq(leakTests.userId, userId));
    }
    return await db.select().from(leakTests);
  }
}

// Create a single instance of the database storage
export const storage = new DatabaseStorage();
