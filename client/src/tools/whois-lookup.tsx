import { useState } from "react";
import { Wand2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { performWhoisLookup, validateWithSchema, whoisLookupSchema, WhoisResult } from "@/lib/tools";
import { apiRequest } from "@/lib/queryClient";

export default function WhoisLookup() {
  const [domain, setDomain] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [whoisData, setWhoisData] = useState<WhoisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleLookup = async () => {
    setError(null);
    
    // Validate domain
    const validation = validateWithSchema(whoisLookupSchema, { domain });
    if (!validation.success) {
      setError(validation.error || "Invalid domain");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await apiRequest('POST', '/api/whois-lookup', { domain });
      const data = await response.json();
      
      setWhoisData(data);
      
      toast({
        title: "WHOIS Lookup Complete",
        description: `Lookup completed for ${domain}`,
      });
    } catch (error) {
      console.error('Error performing WHOIS lookup:', error);
      setWhoisData(null);
      setError("Failed to perform WHOIS lookup. Please try again.");
      
      toast({
        title: "Lookup Failed",
        description: "Could not complete the WHOIS lookup. Please try again.",
        variant: "destructive",
      });
      
      // For demo purposes, show mock result
      setWhoisData({
        registrar: "NameCheap, Inc.",
        created: "2020-03-14",
        expires: "2025-03-14",
        updated: "2023-02-28",
        status: ["clientTransferProhibited"],
        nameServers: ["ns1.example.net", "ns2.example.net"]
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="tool-card bg-dark-card rounded-lg overflow-hidden border border-gray-800 h-full">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-display font-medium text-white">WHOIS Lookup</h3>
          <div className="bg-[rgba(19,136,8,0.1)] p-2 rounded">
            <Wand2 className="h-5 w-5 text-indian-green" />
          </div>
        </div>
        <div className="mb-4">
          <div className="flex space-x-2 mb-4">
            <Input
              type="text"
              className="cyber-input flex-grow bg-dark-bg p-3 rounded text-light-text"
              placeholder="Enter domain name (e.g., example.com)"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
            />
            <Button
              className="bg-[rgba(19,136,8,0.1)] hover:bg-[rgba(19,136,8,0.2)] text-indian-green py-2 px-4 rounded transition-colors border border-[rgba(19,136,8,0.2)] whitespace-nowrap"
              onClick={handleLookup}
              disabled={isLoading || !domain}
            >
              {isLoading ? "Loading..." : "Lookup"}
            </Button>
          </div>
          
          <div className="bg-dark-bg rounded p-4 font-mono text-xs space-y-2 border border-gray-800 max-h-[280px] overflow-y-auto">
            {error ? (
              <p className="text-red-500">{error}</p>
            ) : whoisData ? (
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
                <span className="text-light-text col-span-2">{whoisData.nameServers.join('\n')}</span>
              </div>
            ) : (
              <p className="text-muted-text">// Domain information will appear here</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
