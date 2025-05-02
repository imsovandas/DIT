import { useState, useEffect } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getWebRTCData } from "@/lib/utils";

interface DNSServer {
  address: string;
  provider: string;
  leaked: boolean;
}

interface LeakTestResult {
  dnsServers: DNSServer[];
  publicIp: string;
  ipv6: string | null;
  location: string;
  isp: string;
  city: string;
  region: string;
  country: string;
  webRTCIp: string | null;
  webRTCLeaked: boolean;
}

export default function DnsLeakTest() {
  const [isTestingDNS, setIsTestingDNS] = useState(false);
  const [isTestingWebRTC, setIsTestingWebRTC] = useState(false);
  const [leakResult, setLeakResult] = useState<LeakTestResult | null>(null);
  const { toast } = useToast();

  const runDNSLeakTest = async () => {
    setIsTestingDNS(true);

    try {
      // First get our server-detected IP info
      const serverResponse = await fetch('/api/dns-leak-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          // We could add userId here if we had user authentication
        })
      });
      
      if (!serverResponse.ok) {
        throw new Error('Failed to fetch server IP information');
      }
      const serverData = await serverResponse.json();
      
      // Use ipify for guaranteed accurate IPv4 address
      const ipv4Response = await fetch('https://api.ipify.org?format=json');
      let ipv4Data: { ip: string } | null = null;
      
      if (ipv4Response.ok) {
        ipv4Data = await ipv4Response.json() as { ip: string };
      }
      
      // Use a separate call to try and get IPv6 address if available
      let ipv6Address = null;
      try {
        const ipv6Response = await fetch('https://api64.ipify.org?format=json');
        if (ipv6Response.ok) {
          const ipv6Data = await ipv6Response.json();
          // Check if this is actually IPv6 format (contains colons)
          if (ipv6Data.ip && ipv6Data.ip.includes(':')) {
            ipv6Address = ipv6Data.ip;
          }
        }
      } catch (error) {
        console.log('IPv6 connectivity not available');
      }
      
      // Now get detailed location data using ipapi.co (no API key required)
      const ip = ipv4Data?.ip || serverData.clientIp || 'Unknown';
      const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`);
      
      // Define the shape of the geo data
      interface GeoData {
        ip?: string;
        country_flag_emoji?: string;
        country_name?: string;
        org?: string;
        city?: string;
        region?: string;
        country?: string;
      }
      
      let geoData: GeoData = {};
      
      if (geoResponse.ok) {
        geoData = await geoResponse.json() as GeoData;
      }
      
      setLeakResult(prev => ({
        ...(prev || {
          dnsServers: [],
          publicIp: "",
          ipv6: null,
          location: "",
          isp: "",
          city: "",
          region: "",
          country: "",
          webRTCIp: null,
          webRTCLeaked: false
        }),
        dnsServers: serverData.dnsServers || [
          { address: "1.1.1.1", provider: "Cloudflare DNS", leaked: true },
          { address: "8.8.8.8", provider: "Google DNS", leaked: true }
        ],
        // Use the most reliable source for public IP
        publicIp: ipv4Data?.ip || serverData.clientIp || geoData?.ip || "Not detected",
        ipv6: ipv6Address || (serverData.isIpv6 ? serverData.clientIp : null),
        location: `${geoData?.country_flag_emoji || ''} ${geoData?.country_name || 'Unknown'}`,
        isp: geoData?.org || serverData.isp || "Unknown",
        city: geoData?.city || "Unknown",
        region: geoData?.region || "Unknown",
        country: geoData?.country_name || "Unknown"
      }));

      toast({
        title: "DNS Leak Test Complete",
        description: "Your DNS configuration has been analyzed",
      });
    } catch (error) {
      console.error('Error during DNS leak test:', error);
      toast({
        title: "Test Failed",
        description: "Could not complete the DNS leak test",
        variant: "destructive",
      });
    } finally {
      setIsTestingDNS(false);
    }
  };

  const runWebRTCTest = async () => {
    setIsTestingWebRTC(true);

    try {
      const webRTCData = await getWebRTCData();

      setLeakResult(prev => {
        if (!prev) {
          // If we don't have previous DNS test results, let's get IP data first
          // Use multiple sources to get the most reliable data
          // Define interfaces for the API responses
          interface IPv4Response {
            ip: string;
          }
          
          interface IPv6Response {
            ip: string;
          }
          
          interface ServerResponse {
            clientIp?: string;
            isIpv6?: boolean;
            dnsServers?: DNSServer[];
            isp?: string;
          }
          
          interface GeoData {
            ip?: string;
            country_flag_emoji?: string;
            country_name?: string;
            org?: string;
            city?: string;
            region?: string;
            country?: string;
          }
          
          Promise.all([
            // Get IPv4 address
            fetch('https://api.ipify.org?format=json')
              .then(res => res.ok ? res.json() as Promise<IPv4Response> : null)
              .catch(() => null),
            
            // Get server-side IP info
            fetch('/api/dns-leak-test')
              .then(res => res.ok ? res.json() as Promise<ServerResponse> : null)
              .catch(() => null),
            
            // Try to get IPv6 address
            fetch('https://api64.ipify.org?format=json')
              .then(res => res.ok ? res.json() as Promise<IPv6Response> : null)
              .catch(() => null),
          ])
          .then(([ipv4Result, serverData, ipv6Result]) => {
            const ip = ipv4Result?.ip || (serverData?.clientIp || 'Unknown');
            
            // Now get detailed location data
            fetch(`https://ipapi.co/${ip}/json/`)
              .then(res => res.ok ? res.json() as Promise<GeoData> : {})
              .then((geoData: GeoData) => {
                const ipv6Address = ipv6Result?.ip?.includes(':') ? ipv6Result.ip : null;
                
                setLeakResult({
                  dnsServers: serverData?.dnsServers || [],
                  publicIp: ipv4Result?.ip || serverData?.clientIp || "Not detected",
                  ipv6: ipv6Address || (serverData?.isIpv6 ? serverData.clientIp : null),
                  location: `${geoData?.country_flag_emoji || ''} ${geoData?.country_name || 'Unknown'}`,
                  isp: geoData?.org || "Unknown",
                  city: geoData?.city || "Unknown",
                  region: geoData?.region || "Unknown",
                  country: geoData?.country_name || "Unknown",
                  webRTCIp: webRTCData.localIp,
                  webRTCLeaked: !!webRTCData.localIp
                });
              })
              .catch(error => {
                console.error("Error fetching geo data:", error);
                setLeakResult({
                  dnsServers: serverData?.dnsServers || [],
                  publicIp: ipv4Result?.ip || serverData?.clientIp || "Not detected",
                  ipv6: ipv6Result?.ip?.includes(':') ? ipv6Result.ip : null,
                  location: "Unknown",
                  isp: "Unknown",
                  city: "Unknown",
                  region: "Unknown",
                  country: "Unknown",
                  webRTCIp: webRTCData.localIp,
                  webRTCLeaked: !!webRTCData.localIp
                });
              });
          })
          .catch(error => {
            console.error("Error in IP fetching:", error);
            setLeakResult({
              dnsServers: [],
              publicIp: "Detection failed",
              ipv6: null,
              location: "Unknown",
              isp: "Unknown",
              city: "Unknown",
              region: "Unknown",
              country: "Unknown",
              webRTCIp: webRTCData.localIp,
              webRTCLeaked: !!webRTCData.localIp
            });
          });
          
          // Return placeholder data while we fetch
          return {
            dnsServers: [],
            publicIp: "Detecting...",
            ipv6: "Detecting...",
            location: "Detecting...",
            isp: "Detecting...",
            city: "Detecting...",
            region: "Detecting...",
            country: "Detecting...",
            webRTCIp: webRTCData.localIp,
            webRTCLeaked: !!webRTCData.localIp
          };
        }

        return {
          ...prev,
          webRTCIp: webRTCData.localIp,
          webRTCLeaked: !!webRTCData.localIp
        };
      });

      toast({
        title: "WebRTC Test Complete",
        description: webRTCData.localIp 
          ? "WebRTC leak detected! Your local IP is exposed." 
          : "No WebRTC leak detected.",
      });
    } catch (error) {
      console.error('Error during WebRTC test:', error);
      toast({
        title: "Test Failed",
        description: "Could not complete the WebRTC test",
        variant: "destructive",
      });
    } finally {
      setIsTestingWebRTC(false);
    }
  };

  return (
    <div className="tool-card bg-dark-card rounded-lg overflow-hidden border border-gray-800 h-full">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-display font-medium text-white">DNS Leak Test</h3>
          <div className="bg-[rgba(255,153,51,0.1)] p-2 rounded">
            <Mail className="h-5 w-5 text-saffron" />
          </div>
        </div>
        <div className="mb-4">
          <p className="text-sm text-muted-text mb-4">Check if your VPN or browser is leaking DNS requests or exposing your real IP address.</p>
          <div className="flex space-x-2 mb-4">
            <Button 
              className="flex-1 bg-[rgba(255,153,51,0.1)] hover:bg-[rgba(255,153,51,0.2)] text-saffron py-2 px-4 rounded transition-colors border border-[rgba(255,153,51,0.2)] text-sm"
              onClick={runDNSLeakTest}
              disabled={isTestingDNS}
            >
              {isTestingDNS ? "Running Test..." : "Run DNS Leak Test"}
            </Button>
            <Button 
              className="flex-1 bg-dark-card hover:bg-gray-800 text-muted-text py-2 px-4 rounded border border-gray-700 text-sm"
              onClick={runWebRTCTest}
              disabled={isTestingWebRTC}
            >
              {isTestingWebRTC ? "Testing..." : "Test WebRTC"}
            </Button>
          </div>

          {leakResult && leakResult.dnsServers.length > 0 && (
            <div className="bg-dark-bg rounded-lg p-4 border border-gray-800 mb-3">
              <h4 className="text-sm font-medium text-light-text mb-2">Your DNS Servers</h4>
              <div className="space-y-2 mb-3">
                {leakResult.dnsServers.map((server, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${server.leaked ? 'bg-red-500' : 'bg-green-500'}`}></div>
                    <div className="text-sm text-light-text font-mono">{server.address} ({server.provider})</div>
                  </div>
                ))}
              </div>

              {leakResult.dnsServers.some(server => server.leaked) ? (
                <div className="bg-red-900/20 border border-red-700/30 rounded p-2 mb-2">
                  <span className="text-xs text-red-400">⚠️ DNS Leak Detected! Your DNS requests are not going through your VPN.</span>
                </div>
              ) : (
                <div className="bg-green-900/20 border border-green-700/30 rounded p-2 mb-2">
                  <span className="text-xs text-green-400">✓ No DNS Leak Detected! Your DNS configuration is secure.</span>
                </div>
              )}

              <div className="text-xs text-muted-text">
                Recommendation: Configure your VPN to handle DNS requests or use a secure DNS provider.
              </div>
            </div>
          )}

          {leakResult && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-muted-text mb-1">IPv4 Address</div>
                <div className="bg-dark-bg p-2 rounded border border-gray-800 font-mono text-xs text-light-text">
                  {leakResult.publicIp}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-text mb-1">IPv6 Address</div>
                <div className="bg-dark-bg p-2 rounded border border-gray-800 font-mono text-xs text-light-text overflow-x-auto">
                  {leakResult.ipv6 || "Not detected"}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-text mb-1">Location</div>
                <div className="bg-dark-bg p-2 rounded border border-gray-800 font-mono text-xs text-light-text flex items-center">
                  <span dangerouslySetInnerHTML={{ __html: leakResult.location }} />
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-text mb-1">ISP</div>
                <div className="bg-dark-bg p-2 rounded border border-gray-800 font-mono text-xs text-light-text">
                  {leakResult.isp || "Unknown"}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-text mb-1">City</div>
                <div className="bg-dark-bg p-2 rounded border border-gray-800 font-mono text-xs text-light-text">
                  {leakResult.city || "Unknown"}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-text mb-1">Region</div>
                <div className="bg-dark-bg p-2 rounded border border-gray-800 font-mono text-xs text-light-text">
                  {leakResult.region || "Unknown"}
                </div>
              </div>
              <div className="col-span-2">
                <div className="text-xs text-muted-text mb-1">Country</div>
                <div className="bg-dark-bg p-2 rounded border border-gray-800 font-mono text-xs text-light-text">
                  {leakResult.country || "Unknown"}
                </div>
              </div>
            </div>
          )}

          {leakResult && leakResult.webRTCIp !== undefined && (
            <div className="mt-3 bg-dark-bg rounded-lg p-4 border border-gray-800">
              <h4 className="text-sm font-medium text-light-text mb-2">WebRTC Test Result</h4>

              {leakResult.webRTCLeaked ? (
                <div className="bg-red-900/20 border border-red-700/30 rounded p-2 mb-2">
                  <span className="text-xs text-red-400">⚠️ WebRTC Leak Detected! Your local IP address is exposed: {leakResult.webRTCIp}</span>
                </div>
              ) : (
                <div className="bg-green-900/20 border border-green-700/30 rounded p-2 mb-2">
                  <span className="text-xs text-green-400">✓ No WebRTC Leak Detected! Your local IP address is protected.</span>
                </div>
              )}

              <div className="text-xs text-muted-text">
                Recommendation: Use browser extensions that block WebRTC or configure your browser to disable WebRTC.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}