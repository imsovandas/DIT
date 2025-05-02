import { useState, useEffect } from "react";
import { Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { parseUserAgent } from "@/lib/utils";

interface BrowserFingerprint {
  userAgent: string;
  browser: string;
  os: string;
  device: string;
  screenResolution: string;
  language: string;
  timezone: string;
  plugins?: string[];
  canvas?: string;
  webGL?: string;
  fonts?: string[];
  privacyScore: number;
}

export default function BrowserFingerprint() {
  const [fingerprint, setFingerprint] = useState<BrowserFingerprint | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const analyzeBrowser = async () => {
    setIsAnalyzing(true);
    
    try {
      // Get browser information
      const userAgentData = parseUserAgent(navigator.userAgent);
      
      // For a real app, we would collect more fingerprint data
      // For demonstration, we'll use basic information
      
      // Calculate a mock privacy risk score (0-100)
      const privacyScore = Math.floor(Math.random() * 30) + 35; // Random score between 35-65
      
      const fingerprintData: BrowserFingerprint = {
        ...userAgentData,
        privacyScore
      };
      
      setFingerprint(fingerprintData);
      
      toast({
        title: "Analysis Complete",
        description: "Your browser fingerprint has been analyzed",
      });
    } catch (error) {
      console.error('Error analyzing browser:', error);
      
      toast({
        title: "Analysis Failed",
        description: "Could not complete the browser fingerprint analysis",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="tool-card bg-dark-card rounded-lg overflow-hidden border border-gray-800 h-full">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-display font-medium text-white">Browser Fingerprint</h3>
          <div className="bg-[rgba(19,136,8,0.1)] p-2 rounded">
            <Monitor className="h-5 w-5 text-indian-green" />
          </div>
        </div>
        <div className="mb-4">
          <p className="text-sm text-muted-text mb-3">See what information your browser is revealing about you.</p>
          <Button
            className="w-full bg-[rgba(19,136,8,0.1)] hover:bg-[rgba(19,136,8,0.2)] text-indian-green py-2 px-4 rounded transition-colors border border-[rgba(19,136,8,0.2)] text-sm mb-4"
            onClick={analyzeBrowser}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? "Analyzing..." : "Analyze My Browser"}
          </Button>
          
          {fingerprint && (
            <>
              <div className="bg-dark-bg rounded-lg border border-gray-800 overflow-hidden mb-3">
                <div className="p-3 border-b border-gray-800">
                  <h4 className="text-sm font-medium text-light-text">Browser Information</h4>
                </div>
                <div className="p-3 space-y-3">
                  <div className="grid grid-cols-3 gap-1">
                    <div className="text-xs text-cyber-blue">User Agent:</div>
                    <div className="text-xs text-light-text col-span-2 font-mono overflow-x-auto">{fingerprint.userAgent}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <div className="text-xs text-cyber-blue">Browser:</div>
                    <div className="text-xs text-light-text col-span-2">{fingerprint.browser}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <div className="text-xs text-cyber-blue">OS:</div>
                    <div className="text-xs text-light-text col-span-2">{fingerprint.os}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <div className="text-xs text-cyber-blue">Device:</div>
                    <div className="text-xs text-light-text col-span-2">{fingerprint.device}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <div className="text-xs text-cyber-blue">Screen:</div>
                    <div className="text-xs text-light-text col-span-2">{fingerprint.screenResolution}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <div className="text-xs text-cyber-blue">Language:</div>
                    <div className="text-xs text-light-text col-span-2">{fingerprint.language}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <div className="text-xs text-cyber-blue">Timezone:</div>
                    <div className="text-xs text-light-text col-span-2">{fingerprint.timezone}</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-900/20 border border-yellow-700/30 rounded p-3">
                <h4 className="text-xs font-medium text-yellow-400 mb-1">Privacy Risk Assessment:</h4>
                <div className="flex items-center mb-1">
                  <div className="w-full h-2 bg-dark-bg rounded-full mr-2">
                    <div 
                      className="h-2 bg-yellow-500 rounded-full" 
                      style={{ width: `${fingerprint.privacyScore}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-yellow-400 whitespace-nowrap">{fingerprint.privacyScore}%</span>
                </div>
                <p className="text-xs text-muted-text">
                  {fingerprint.privacyScore > 70 
                    ? "Your browser fingerprint is highly unique, making you easily trackable online."
                    : fingerprint.privacyScore > 40
                    ? "Your browser fingerprint is fairly unique, making you more trackable online."
                    : "Your browser has good fingerprinting protection."}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
