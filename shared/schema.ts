import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Base user table (from original schema)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// URL Scan History
export const urlScans = pgTable("url_scans", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  isClean: boolean("is_clean").notNull(),
  positives: integer("positives").notNull(),
  total: integer("total").notNull(),
  scanners: text("scanners").array().notNull(),
  scannedAt: timestamp("scanned_at").defaultNow().notNull(),
  userId: integer("user_id").references(() => users.id),
});

export const insertUrlScanSchema = createInsertSchema(urlScans).pick({
  url: true,
  isClean: true,
  positives: true, 
  total: true,
  scanners: true,
  userId: true,
});

// WHOIS Lookup History
export const whoisLookups = pgTable("whois_lookups", {
  id: serial("id").primaryKey(),
  domain: text("domain").notNull(),
  registrar: text("registrar"),
  created: text("created"),
  expires: text("expires"),
  updated: text("updated"),
  status: text("status").array(),
  nameServers: text("name_servers").array(),
  queriedAt: timestamp("queried_at").defaultNow().notNull(),
  userId: integer("user_id").references(() => users.id),
});

export const insertWhoisLookupSchema = createInsertSchema(whoisLookups).pick({
  domain: true,
  registrar: true,
  created: true,
  expires: true,
  updated: true,
  status: true,
  nameServers: true,
  userId: true,
});

// File Hash Records
export const fileHashes = pgTable("file_hashes", {
  id: serial("id").primaryKey(),
  fileName: text("file_name").notNull(),
  fileSize: text("file_size").notNull(),
  md5: text("md5").notNull(),
  sha1: text("sha1"),
  sha256: text("sha256"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  userId: integer("user_id").references(() => users.id),
});

export const insertFileHashSchema = createInsertSchema(fileHashes).pick({
  fileName: true,
  fileSize: true,
  md5: true,
  sha1: true,
  sha256: true,
  userId: true,
});

// Saved Passwords (for password generator history)
export const savedPasswords = pgTable("saved_passwords", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  strength: text("strength").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
});

export const insertSavedPasswordSchema = createInsertSchema(savedPasswords).pick({
  name: true,
  strength: true,
  userId: true,
});

// DNS/WebRTC Leak Test Results
export const leakTests = pgTable("leak_tests", {
  id: serial("id").primaryKey(),
  testType: text("test_type").notNull(), // 'dns' or 'webrtc'
  clientIp: text("client_ip"),
  leakDetected: boolean("leak_detected"),
  details: jsonb("details"),
  testedAt: timestamp("tested_at").defaultNow().notNull(),
  userId: integer("user_id").references(() => users.id),
});

export const insertLeakTestSchema = createInsertSchema(leakTests).pick({
  testType: true,
  clientIp: true,
  leakDetected: true,
  details: true,
  userId: true,
});

// Define the Zod schemas for API validations
export const urlScanSchema = z.object({
  url: z.string().url("Please enter a valid URL")
});

export const whoisLookupSchema = z.object({
  domain: z.string().min(1, "Domain is required")
    .regex(/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/, "Please enter a valid domain")
});

export const fileHashCheckSchema = z.object({
  hash: z.string().min(32, "Invalid hash length").max(128, "Invalid hash length")
});

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertUrlScan = z.infer<typeof insertUrlScanSchema>;
export type UrlScan = typeof urlScans.$inferSelect;

export type InsertWhoisLookup = z.infer<typeof insertWhoisLookupSchema>;
export type WhoisLookup = typeof whoisLookups.$inferSelect;

export type InsertFileHash = z.infer<typeof insertFileHashSchema>;
export type FileHash = typeof fileHashes.$inferSelect;

export type InsertSavedPassword = z.infer<typeof insertSavedPasswordSchema>;
export type SavedPassword = typeof savedPasswords.$inferSelect;

export type InsertLeakTest = z.infer<typeof insertLeakTestSchema>;
export type LeakTest = typeof leakTests.$inferSelect;

// API types
export type UrlScanRequest = z.infer<typeof urlScanSchema>;
export type WhoisLookupRequest = z.infer<typeof whoisLookupSchema>;
export type FileHashCheckRequest = z.infer<typeof fileHashCheckSchema>;
