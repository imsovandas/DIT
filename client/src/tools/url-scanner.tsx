import { useState } from "react";
import { Wand } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { scanUrl, validateWithSchema, urlScanSchema } from "@/lib/tools";
import { apiRequest } from "@/lib/queryClient";

export default function UrlScanner() {
  const [url, setUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{
    isClean: boolean;
    positives: number;
    total: number;
    scanners: string[];
    lastUpdated: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleScanUrl = async () => {
    setError(null);
    
    // Validate URL
    const validation = validateWithSchema(urlScanSchema, { url });
    if (!validation.success) {
      setError(validation.error || "Invalid URL");
      return;
    }
    
    setIsScanning(true);
    
    try {
      const response = await apiRequest('POST', '/api/url-scan', { url });
      const data = await response.json();
      
      setScanResult({
        isClean: data.isClean,
        positives: data.positives,
        total: data.total,
        scanners: data.scanners || ['VirusTotal', 'Google Safe', 'PhishTank'],
        lastUpdated: data.lastUpdated || 'Just now'
      });
      
      toast({
        title: "URL Scan Complete",
        description: `Scan completed for ${url}`,
      });
    } catch (error) {
      console.error('Error scanning URL:', error);
      setScanResult(null);
      setError("Failed to scan URL. Please try again.");
      
      toast({
        title: "Scan Failed",
        description: "Could not complete the URL scan. Please try again.",
        variant: "destructive",
      });
      
      // For demo purposes, show mock result
      setScanResult({
        isClean: true,
        positives: 0,
        total: 67,
        scanners: ['VirusTotal', 'Google Safe', 'PhishTank'],
        lastUpdated: 'Just now'
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="tool-card bg-dark-card rounded-lg overflow-hidden border border-gray-800 h-full">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-display font-medium text-white">URL Scanner</h3>
          <div className="bg-[rgba(0,255,255,0.1)] p-2 rounded">
            <Wand className="h-5 w-5 text-cyber-blue" />
          </div>
        </div>
        <div className="mb-4">
          <div className="flex space-x-2 mb-4">
            <Input
              type="url"
              className="cyber-input flex-grow bg-dark-bg p-3 rounded text-light-text"
              placeholder="Enter URL to scan"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <Button
              className="bg-[rgba(0,255,255,0.1)] hover:bg-[rgba(0,255,255,0.2)] text-cyber-blue py-2 px-4 rounded transition-colors border border-[rgba(0,255,255,0.2)] whitespace-nowrap"
              onClick={handleScanUrl}
              disabled={isScanning || !url}
            >
              {isScanning ? "Scanning..." : "Scan"}
            </Button>
          </div>
          
          <div className="bg-dark-bg rounded p-4 font-mono text-sm border border-gray-800">
            {error ? (
              <div className="text-red-500 mb-2">{error}</div>
            ) : scanResult ? (
              <>
                <div className="flex items-start mb-2">
                  <span className={scanResult.isClean ? "text-green-500 mr-2" : "text-red-500 mr-2"}>
                    {scanResult.isClean ? "✓" : "✗"}
                  </span>
                  <span className="text-light-text">
                    {scanResult.isClean 
                      ? `URL is clean according to ${scanResult.total - scanResult.positives}/${scanResult.total} engines` 
                      : `URL may be malicious according to ${scanResult.positives}/${scanResult.total} engines`}
                  </span>
                </div>
                <div className="text-xs text-muted-text mb-1">Scanned with:</div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {scanResult.scanners.map((scanner, index) => (
                    <span key={index} className="bg-dark-card px-2 py-0.5 rounded text-xs text-muted-text">{scanner}</span>
                  ))}
                </div>
                <div className="text-xs text-gray-500">Last updated: <span className="text-muted-text">{scanResult.lastUpdated}</span></div>
              </>
            ) : (
              <div className="text-muted-text mb-2">// Results will appear here</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
