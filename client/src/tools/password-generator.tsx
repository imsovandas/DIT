import { useState, useRef, useEffect } from "react";
import { Lock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { generateRandomPassword, copyToClipboard } from "@/lib/utils";

export default function PasswordGenerator() {
  const [passwordLength, setPasswordLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  // Generate password on initial render and when options change
  useEffect(() => {
    generatePassword();
  }, []);

  const generatePassword = () => {
    const newPassword = generateRandomPassword(
      passwordLength,
      uppercase,
      lowercase,
      numbers,
      symbols
    );
    setPassword(newPassword);
  };

  const handleCopyPassword = async () => {
    const success = await copyToClipboard(password);
    if (success) {
      toast({
        title: "Password Copied!",
        description: "Password has been copied to clipboard.",
      });
    } else {
      toast({
        title: "Copy Failed",
        description: "Failed to copy password to clipboard.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="tool-card bg-dark-card rounded-lg overflow-hidden border border-gray-800 h-full">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-display font-medium text-white">Password Generator</h3>
          <div className="bg-[rgba(255,153,51,0.1)] p-2 rounded">
            <Lock className="h-5 w-5 text-saffron" />
          </div>
        </div>
        <div className="mb-4">
          <div className="cyber-input bg-dark-bg p-3 rounded flex items-center justify-between mb-3">
            <div className="text-light-text font-mono text-sm truncate">{password}</div>
            <button 
              onClick={handleCopyPassword}
              className="text-cyber-blue hover:text-white transition-colors focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
              </svg>
            </button>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password-length" className="text-xs text-muted-text">Length: <span id="length-value">{passwordLength}</span></label>
              <Slider
                className="w-32 accent-cyber-blue"
                id="password-length"
                defaultValue={[passwordLength]}
                min={8}
                max={32}
                step={1}
                onValueChange={(values) => setPasswordLength(values[0])}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="uppercase" 
                checked={uppercase} 
                onCheckedChange={(checked) => setUppercase(checked as boolean)}
                className="rounded bg-dark-bg border-gray-600 data-[state=checked]:bg-cyber-blue data-[state=checked]:text-white"
              />
              <label htmlFor="uppercase" className="text-xs text-muted-text">Uppercase</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="lowercase" 
                checked={lowercase} 
                onCheckedChange={(checked) => setLowercase(checked as boolean)}
                className="rounded bg-dark-bg border-gray-600 data-[state=checked]:bg-cyber-blue data-[state=checked]:text-white"
              />
              <label htmlFor="lowercase" className="text-xs text-muted-text">Lowercase</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="numbers" 
                checked={numbers} 
                onCheckedChange={(checked) => setNumbers(checked as boolean)}
                className="rounded bg-dark-bg border-gray-600 data-[state=checked]:bg-cyber-blue data-[state=checked]:text-white"
              />
              <label htmlFor="numbers" className="text-xs text-muted-text">Numbers</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="symbols" 
                checked={symbols} 
                onCheckedChange={(checked) => setSymbols(checked as boolean)}
                className="rounded bg-dark-bg border-gray-600 data-[state=checked]:bg-cyber-blue data-[state=checked]:text-white"
              />
              <label htmlFor="symbols" className="text-xs text-muted-text">Symbols</label>
            </div>
          </div>
        </div>
        <Button
          className="w-full bg-[rgba(255,153,51,0.1)] hover:bg-[rgba(255,153,51,0.2)] text-saffron border border-[rgba(255,153,51,0.2)] text-sm"
          onClick={generatePassword}
        >
          Generate Password
        </Button>
      </div>
    </div>
  );
}
