import { useState, useRef } from "react";
import { FileText, ClipboardCopy, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { computeFileHash } from "@/lib/crypto";
import { copyToClipboard } from "@/lib/utils";

export default function FileHashChecker() {
  const [file, setFile] = useState<File | null>(null);
  const [algorithm, setAlgorithm] = useState("SHA256");
  const [generatedHash, setGeneratedHash] = useState("");
  const [compareHash, setCompareHash] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [hashMatch, setHashMatch] = useState<boolean | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      // Reset hash states
      setGeneratedHash("");
      setHashMatch(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      // Reset hash states
      setGeneratedHash("");
      setHashMatch(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const browseFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const generateHash = async () => {
    if (!file) {
      toast({
        title: "No File Selected",
        description: "Please select a file to generate hash",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      const hash = await computeFileHash(file, algorithm);
      setGeneratedHash(hash);
      
      // Check if compare hash is set and compare
      if (compareHash) {
        setHashMatch(compareHash.toLowerCase() === hash.toLowerCase());
      } else {
        setHashMatch(null);
      }
      
      toast({
        title: "Hash Generated",
        description: `${algorithm} hash generated successfully`,
      });
    } catch (error) {
      console.error('Error generating hash:', error);
      toast({
        title: "Hash Generation Failed",
        description: error instanceof Error ? error.message : "An error occurred generating the hash",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyHash = async () => {
    if (!generatedHash) return;
    
    const success = await copyToClipboard(generatedHash);
    if (success) {
      toast({
        title: "Hash Copied!",
        description: "The hash has been copied to your clipboard",
      });
    } else {
      toast({
        title: "Copy Failed",
        description: "Failed to copy hash to clipboard",
        variant: "destructive"
      });
    }
  };

  const checkInVirusTotal = () => {
    if (!generatedHash) return;
    
    const url = `https://www.virustotal.com/gui/file/${generatedHash}`;
    window.open(url, '_blank');
  };

  const handleCompareHashChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCompareHash = e.target.value;
    setCompareHash(newCompareHash);
    
    if (newCompareHash && generatedHash) {
      setHashMatch(newCompareHash.toLowerCase() === generatedHash.toLowerCase());
    } else {
      setHashMatch(null);
    }
  };

  return (
    <div className="tool-card bg-dark-card rounded-lg overflow-hidden border border-gray-800 h-full">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-display font-medium text-white">File Hash Checker</h3>
          <div className="bg-[rgba(0,255,255,0.1)] p-2 rounded">
            <FileText className="h-5 w-5 text-cyber-blue" />
          </div>
        </div>
        <div className="mb-4">
          <div className="mb-4">
            <div
              className="bg-dark-bg border border-dashed border-gray-700 rounded-lg p-6 text-center mb-4"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <Upload className="h-10 w-10 mx-auto text-muted-text mb-2" />
              <p className="text-sm text-muted-text mb-2">
                {file ? file.name : "Drop file here or"}
              </p>
              <Button
                className="bg-dark-card hover:bg-gray-800 text-light-text py-1 px-4 rounded text-sm border border-gray-700"
                onClick={browseFile}
              >
                Browse File
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            
            <div className="mb-3">
              <Label className="block text-xs text-muted-text mb-1">Hash Algorithm</Label>
              <Select 
                value={algorithm} 
                onValueChange={setAlgorithm}
              >
                <SelectTrigger className="cyber-input w-full bg-dark-bg p-2 rounded text-light-text">
                  <SelectValue placeholder="Select algorithm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MD5">MD5</SelectItem>
                  <SelectItem value="SHA1">SHA-1</SelectItem>
                  <SelectItem value="SHA256">SHA-256</SelectItem>
                  <SelectItem value="SHA512">SHA-512</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="mb-3">
              <Label className="block text-xs text-muted-text mb-1">Generated Hash</Label>
              <div className="cyber-input bg-dark-bg p-3 rounded flex items-center justify-between">
                <div className="text-light-text font-mono text-xs truncate">
                  {generatedHash || "Hash will appear here after processing"}
                </div>
                {generatedHash && (
                  <Button
                    className="text-cyber-blue hover:text-white transition-colors bg-transparent border-0 p-0"
                    onClick={handleCopyHash}
                    size="sm"
                  >
                    <ClipboardCopy className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            
            <div className="flex justify-between mb-2">
              <Label className="block text-xs text-muted-text">Compare with known hash</Label>
              {generatedHash && (
                <Button 
                  variant="link" 
                  className="text-xs text-cyber-blue hover:underline p-0 h-auto"
                  onClick={checkInVirusTotal}
                >
                  Check in VirusTotal
                </Button>
              )}
            </div>
            
            <Input 
              type="text" 
              className="cyber-input w-full bg-dark-bg p-2 rounded text-light-text mb-3" 
              placeholder="Paste hash to compare"
              value={compareHash}
              onChange={handleCompareHashChange}
            />
            
            {hashMatch !== null && (
              <div className={`${hashMatch ? 'bg-green-900/20 border-green-700/30 text-green-500' : 'bg-red-900/20 border-red-700/30 text-red-500'} border rounded p-3 text-center`}>
                <span className="text-sm">
                  {hashMatch 
                    ? "✓ Hashes match! File integrity verified." 
                    : "✗ Hashes don't match! File may be corrupted or modified."}
                </span>
              </div>
            )}
            
            <Button
              className="w-full mt-3 bg-[rgba(0,255,255,0.1)] hover:bg-[rgba(0,255,255,0.2)] text-cyber-blue py-2 rounded transition-colors border border-[rgba(0,255,255,0.2)] text-sm"
              onClick={generateHash}
              disabled={isProcessing || !file}
            >
              {isProcessing ? "Processing..." : "Generate Hash"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
