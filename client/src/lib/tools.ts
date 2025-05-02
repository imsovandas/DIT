import { ZodSchema, z } from "zod";

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  iconColor: string;
}

// Define schemas for API requests
export const urlScanSchema = z.object({
  url: z.string().url("Please enter a valid URL")
});

export const whoisLookupSchema = z.object({
  domain: z.string().min(1, "Domain is required")
    .regex(/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/, "Please enter a valid domain")
});

export type UrlScanRequest = z.infer<typeof urlScanSchema>;
export type WhoisLookupRequest = z.infer<typeof whoisLookupSchema>;

export interface UrlScanResult {
  isClean: boolean;
  positives: number;
  total: number;
  scanners: string[];
  lastUpdated: string;
}

export interface WhoisResult {
  registrar: string;
  created: string;
  expires: string;
  updated: string;
  status: string[];
  nameServers: string[];
}

export interface HashResult {
  md5: string;
  sha1: string;
  sha256: string;
  fileName: string;
  fileSize: string;
}

// In Vite, use import.meta.env instead of process.env for frontend code
export const VIRUS_TOTAL_API_KEY = import.meta.env.VITE_VIRUS_TOTAL_API_KEY || "";

export async function scanUrl(url: string): Promise<UrlScanResult> {
  try {
    const response = await fetch('/api/url-scan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to scan URL');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error scanning URL:', error);
    throw error;
  }
}

export async function performWhoisLookup(domain: string): Promise<WhoisResult> {
  try {
    const response = await fetch('/api/whois-lookup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ domain }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to perform WHOIS lookup');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error performing WHOIS lookup:', error);
    throw error;
  }
}

export function validateWithSchema<T>(schema: ZodSchema, data: unknown): { success: boolean; data?: T; error?: string } {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData as T };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: 'Invalid data' };
  }
}
