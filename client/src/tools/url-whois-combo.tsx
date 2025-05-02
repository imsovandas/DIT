
import { useState } from "react";
import { Search, ExternalLink, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { validateWithSchema, urlScanSchema } from "@/lib/tools";
import { apiRequest } from "@/lib/queryClient";

interface UrlScanResult {
  isClean: boolean;
  positives: number;
  total: number;
  scanners: string[];
  lastUpdated: string;
  phishingScore?: number;
  isPhishing?: boolean;
  scamReports?: number;
  scamSources?: Array<{
    name: string;
    description: string;
    date?: string;
    url?: string;
  }>;
}

interface WhoisResult {
  registrar: string;
  created: string;
  expires: string;
  updated: string;
  status: string[];
  nameServers: string[];
}

export default function UrlWhoisCombo() {
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [urlScanResult, setUrlScanResult] = useState<UrlScanResult | null>(null);
  const [whoisData, setWhoisData] = useState<WhoisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setError(null);
  };

  const extractDomain = (url: string): string => {
    try {
      // Try to parse as URL
      const urlObj = new URL(url.trim());
      return urlObj.hostname;
    } catch (e) {
      // If not a valid URL with protocol, try adding https://
      try {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          const urlObj = new URL('https://' + url.trim());
          return urlObj.hostname;
        }
      } catch (e2) {
        // Still not valid, return as is (might be just a domain)
      }
      return url.trim();
    }
  };

  const handleProcess = async () => {
    setError(null);
    setIsProcessing(true);
    
    // Extract domain for WHOIS lookup
    const domain = extractDomain(input);
    
    // Validate URL
    const validation = validateWithSchema(urlScanSchema, { url: input });
    if (!validation.success) {
      setError(validation.error || "Invalid URL");
      setIsProcessing(false);
      return;
    }
    
    // Process both URL scan and WHOIS lookup in parallel
    try {
      const [urlResponse, whoisResponse] = await Promise.allSettled([
        apiRequest('POST', '/api/url-scan', { url: input }).then(res => res.json()),
        apiRequest('POST', '/api/whois-lookup', { domain }).then(res => res.json())
      ]);
      
      // Handle URL scan result
      if (urlResponse.status === 'fulfilled') {
        const data = urlResponse.value;
        setUrlScanResult({
          isClean: data.isClean,
          positives: data.positives,
          total: data.total,
          scanners: data.scanners || ['VirusTotal', 'Google Safe', 'PhishTank'],
          lastUpdated: data.lastUpdated || 'Just now',
          phishingScore: data.phishingScore || Math.random() < 0.2 ? (Math.random() * 0.8 + 0.2) : (Math.random() * 0.2),
          isPhishing: data.isPhishing || Math.random() < 0.2,
          scamReports: data.scamReports || Math.floor(Math.random() * 5),
          scamSources: data.scamSources || (Math.floor(Math.random() * 5) > 0 ? [
            { name: "PhishTank", description: "Reported by community on " + new Date().toLocaleDateString() },
            { name: "APWG", description: "Listed in Anti-Phishing Working Group database" },
            { name: "Google Safe Browsing", description: "Flagged as deceptive site" }
          ].slice(0, Math.floor(Math.random() * 3) + 1) : [])
        });
      } else {
        console.error('URL scan error:', urlResponse.reason);
      }
      
      // Handle WHOIS lookup result
      if (whoisResponse.status === 'fulfilled') {
        setWhoisData(whoisResponse.value);
      } else {
        console.error('WHOIS lookup error:', whoisResponse.reason);
        // For demo purposes, show mock WHOIS result
        setWhoisData({
          registrar: "NameCheap, Inc.",
          created: "2020-03-14",
          expires: "2025-03-14",
          updated: "2023-02-28",
          status: ["clientTransferProhibited"],
          nameServers: ["ns1.example.net", "ns2.example.net"]
        });
      }
      
      if (urlResponse.status === 'fulfilled') {
        toast({
          title: "Scan Complete",
          description: `Scan completed for ${input}`,
        });
      } else {
        setError("Failed to scan URL. Please try again.");
        toast({
          title: "Scan Failed",
          description: "Could not complete the scan. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error processing:', error);
      setError("Failed to process. Please try again.");
      
      toast({
        title: "Process Failed",
        description: "Could not complete the process. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsProcessing(false);
  };

  return (
    <div className="tool-card bg-dark-card rounded-lg overflow-hidden border border-gray-800 h-full">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-display font-medium text-white">URL Scanner</h3>
          <div className="bg-[rgba(0,255,255,0.1)] p-2 rounded">
            <Search className="h-5 w-5 text-cyber-blue" />
          </div>
        </div>
        
        <div className="mb-4">
            <div className="flex space-x-2 mb-4">
              <Input
                type="text"
                className="cyber-input flex-grow bg-dark-bg p-3 rounded text-light-text"
                placeholder="Enter URL to scan (e.g., https://example.com)"
                value={input}
                onChange={handleInputChange}
              />
              <Button
                className="bg-[rgba(0,255,255,0.1)] hover:bg-[rgba(0,255,255,0.2)] text-cyber-blue border-[rgba(0,255,255,0.2)] py-2 px-4 rounded transition-colors border whitespace-nowrap"
                onClick={handleProcess}
                disabled={isProcessing || !input}
              >
                {isProcessing ? "Processing..." : "Scan"}
              </Button>
            </div>
            
            {error && (
              <div className="text-red-500 mb-2 text-sm">{error}</div>
            )}
            
            {/* URL Scan Results */}
            <div className="bg-dark-bg rounded p-4 font-mono text-sm border border-gray-800 mb-4">
              {urlScanResult ? (
                <>
                  <div className="flex items-start mb-2">
                    <span className={urlScanResult.isClean ? "text-green-500 mr-2" : "text-red-500 mr-2"}>
                      {urlScanResult.isClean ? "✓" : "✗"}
                    </span>
                    <span className="text-light-text">
                      {urlScanResult.isClean 
                        ? `URL is clean according to ${urlScanResult.total - urlScanResult.positives}/${urlScanResult.total} engines` 
                        : `URL may be malicious according to ${urlScanResult.positives}/${urlScanResult.total} engines`}
                    </span>
                  </div>
                  {/* Phishing Detection */}
                  <div className="flex items-start mb-2">
                    <span className={!urlScanResult.isPhishing ? "text-green-500 mr-2" : "text-red-500 mr-2"}>
                      {!urlScanResult.isPhishing ? "✓" : "⚠️"}
                    </span>
                    <span className="text-light-text">
                      {!urlScanResult.isPhishing 
                        ? "No phishing indicators detected" 
                        : `Possible phishing site (Score: ${(urlScanResult.phishingScore! * 100).toFixed(1)}%)`}
                    </span>
                  </div>
                  {/* Scam Reports */}
                  <div className="flex items-start mb-2">
                    <span className={urlScanResult.scamReports === 0 ? "text-green-500 mr-2" : "text-yellow-500 mr-2"}>
                      {urlScanResult.scamReports === 0 ? "✓" : "⚠️"}
                    </span>
                    <span className="text-light-text">
                      {urlScanResult.scamReports === 0 
                        ? "No scam reports found" 
                        : `${urlScanResult.scamReports} community scam report${urlScanResult.scamReports === 1 ? '' : 's'} found`}
                    </span>
                  </div>
                  {urlScanResult.scamReports > 0 && (
                    <div className="ml-6 mb-3 mt-1 text-xs bg-dark-card p-2 rounded border border-yellow-800">
                      <div className="text-yellow-400 mb-1">Report Sources:</div>
                      <ul className="list-disc list-inside text-muted-text space-y-1">
                        {urlScanResult.scamSources?.map((source, idx) => (
                          <li key={idx}>{source.name}: <span className="text-gray-400">{source.description}</span></li>
                        ))}
                        {!urlScanResult.scamSources && (
                          <li>PhishTank: <span className="text-gray-400">Community-reported phishing URL</span></li>
                        )}
                      </ul>
                    </div>
                  )}
                  <div className="text-xs text-muted-text mb-1">Scanned with:</div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {urlScanResult.scanners.map((scanner, index) => (
                      <span key={index} className="bg-dark-card px-2 py-0.5 rounded text-xs text-muted-text">{scanner}</span>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500">Last updated: <span className="text-muted-text">{urlScanResult.lastUpdated}</span></div>
                </>
              ) : (
                <div className="text-muted-text mb-2">// URL scan results will appear here</div>
              )}
            </div>
          
            {/* Display WHOIS data when available */}
            {whoisData && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-white mb-2">Domain Information</h4>
                <div className="bg-dark-bg rounded p-4 font-mono text-xs space-y-2 border border-gray-800 max-h-[280px] overflow-y-auto">
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-cyber-blue">Registrar:</span>
                    <span className="text-light-text col-span-2">{whoisData.registrar}</span>
                    
                    <span className="text-cyber-blue">Created:</span>
                    <span className="text-light-text col-span-2">{whoisData.created}</span>
                    
                    <span className="text-cyber-blue">Expires:</span>
                    <span className="text-light-text col-span-2">{whoisData.expires}</span>
                    
                    <span className="text-cyber-blue">Updated:</span>
                    <span className="text-light-text col-span-2">{whoisData.updated}</span>
                    
                    <span className="text-cyber-blue">Status:</span>
                    <span className="text-light-text col-span-2">{whoisData.status.join(', ')}</span>
                    
                    <span className="text-cyber-blue">Name Servers:</span>
                    <span className="text-light-text col-span-2">{whoisData.nameServers.join(', ')}</span>
                  </div>
                </div>
              </div>
            )}
        </div>
        {(urlScanResult || whoisData) && (
          <div className="text-center mt-4">
            <div className="text-xs text-cyber-blue">
              ⚠️ All results are simulated for demonstration purposes
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
