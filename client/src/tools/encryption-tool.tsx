import { useState } from "react";
import { Lock, Copy } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { encryptData, decryptData, hashData, CryptoOptions } from "@/lib/crypto";
import { copyToClipboard } from "@/lib/utils";

export default function EncryptionTool() {
  const [action, setAction] = useState<'encrypt' | 'decrypt' | 'hash'>('encrypt');
  const [algorithm, setAlgorithm] = useState<CryptoOptions["algorithm"]>('AES');
  const [inputText, setInputText] = useState('');
  const [key, setKey] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleProcess = async () => {
    if (!inputText) {
      toast({
        title: "Input Required",
        description: "Please enter text to process",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      let result = '';
      
      if (action === 'encrypt') {
        result = await encryptData(inputText, { algorithm, mode: 'encrypt', key });
      } else if (action === 'decrypt') {
        result = await decryptData(inputText, { algorithm, mode: 'decrypt', key });
      } else {
        result = hashData(inputText, algorithm);
      }
      
      setOutputText(result);
      
      toast({
        title: "Processing Complete",
        description: `${action.charAt(0).toUpperCase() + action.slice(1)}ion completed successfully`,
      });
    } catch (error) {
      console.error('Processing error:', error);
      toast({
        title: "Processing Failed",
        description: error instanceof Error ? error.message : "An error occurred during processing",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyOutput = async () => {
    if (!outputText) return;
    
    const success = await copyToClipboard(outputText);
    if (success) {
      toast({
        title: "Copied!",
        description: "Output has been copied to clipboard",
      });
    } else {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  // Determine which algorithms to show based on the selected action
  const getAlgorithmOptions = () => {
    if (action === 'encrypt' || action === 'decrypt') {
      return [
        { value: 'AES', label: 'AES-256' },
        { value: 'DES', label: 'DES' },
        { value: 'TripleDES', label: 'Triple DES' },
        { value: 'Rabbit', label: 'Rabbit' },
        { value: 'RC4', label: 'RC4' },
        { value: 'Base64', label: 'Base64' }
      ];
    } else {
      return [
        { value: 'SHA256', label: 'SHA-256' },
        { value: 'SHA512', label: 'SHA-512' },
        { value: 'SHA1', label: 'SHA-1' },
        { value: 'SHA3', label: 'SHA-3' },
        { value: 'MD5', label: 'MD5' }
      ];
    }
  };

  // Reset algorithm when changing action
  const handleActionChange = (value: 'encrypt' | 'decrypt' | 'hash') => {
    setAction(value);
    // Set default algorithm based on action
    if (value === 'hash') {
      setAlgorithm('SHA256');
    } else {
      setAlgorithm('AES');
    }
    setOutputText('');
  };

  return (
    <div className="tool-card bg-dark-card rounded-lg overflow-hidden border border-gray-800 h-full">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-display font-medium text-white">Encryption Tool</h3>
          <div className="bg-[rgba(255,153,51,0.1)] p-2 rounded">
            <Lock className="h-5 w-5 text-saffron" />
          </div>
        </div>
        <div className="mb-4">
          <div className="flex space-x-3 mb-4 bg-dark-bg p-2 rounded">
            <RadioGroup 
              value={action} 
              onValueChange={(value: 'encrypt' | 'decrypt' | 'hash') => handleActionChange(value)}
              className="flex space-x-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem 
                  value="encrypt" 
                  id="encrypt"
                  className="text-cyber-blue"
                />
                <Label htmlFor="encrypt" className="text-xs text-muted-text cursor-pointer">Encrypt</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem 
                  value="decrypt" 
                  id="decrypt"
                  className="text-cyber-blue"
                />
                <Label htmlFor="decrypt" className="text-xs text-muted-text cursor-pointer">Decrypt</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem 
                  value="hash" 
                  id="hash"
                  className="text-cyber-blue"
                />
                <Label htmlFor="hash" className="text-xs text-muted-text cursor-pointer">Hash</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="mb-3">
            <label className="block text-xs text-muted-text mb-1">Algorithm</label>
            <Select 
              value={algorithm} 
              onValueChange={(value) => setAlgorithm(value as CryptoOptions["algorithm"])}
            >
              <SelectTrigger className="cyber-input w-full bg-dark-bg p-2 rounded text-light-text border border-gray-800">
                <SelectValue placeholder="Select algorithm" />
              </SelectTrigger>
              <SelectContent>
                {getAlgorithmOptions().map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="mb-3">
            <label className="block text-xs text-muted-text mb-1">Input</label>
            <Textarea 
              className="cyber-input w-full bg-dark-bg p-3 rounded text-light-text" 
              rows={2} 
              placeholder={`Text to ${action}`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>
          
          {(action === 'encrypt' || action === 'decrypt') && algorithm !== 'Base64' && (
            <div className="mb-3">
              <label className="block text-xs text-muted-text mb-1">
                Encryption Key {algorithm === 'Base64' ? '(not needed)' : ''}
              </label>
              <Input 
                type="password" 
                className="cyber-input w-full bg-dark-bg p-2 rounded text-light-text"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                disabled={algorithm === 'Base64'}
              />
            </div>
          )}
          
          <div className="mb-3">
            <label className="block text-xs text-muted-text mb-1">Output</label>
            <div className="cyber-input bg-dark-bg p-3 rounded text-xs font-mono min-h-[60px] flex items-center relative">
              {outputText ? (
                <div className="w-full overflow-x-auto text-light-text">{outputText}</div>
              ) : (
                <span className="text-muted-text">
                  {action === 'encrypt' 
                    ? 'Encrypted output will appear here' 
                    : action === 'decrypt' 
                      ? 'Decrypted output will appear here' 
                      : 'Hash output will appear here'}
                  <span className="terminal-cursor"></span>
                </span>
              )}
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              className="flex-grow bg-[rgba(255,153,51,0.1)] hover:bg-[rgba(255,153,51,0.2)] text-saffron py-2 rounded transition-colors border border-[rgba(255,153,51,0.2)] text-sm"
              onClick={handleProcess}
              disabled={isProcessing || !inputText}
            >
              {isProcessing ? "Processing..." : "Process"}
            </Button>
            <Button 
              className="bg-dark-card hover:bg-gray-800 text-muted-text p-2 rounded border border-gray-700"
              onClick={handleCopyOutput}
              disabled={!outputText}
            >
              <Copy className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
