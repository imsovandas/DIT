import PasswordGenerator from "../tools/password-generator";
import PasswordStrength from "../tools/password-strength";
import UrlWhoisCombo from "@/tools/url-whois-combo"; // Updated import
import EncryptionTool from "../tools/encryption-tool";
import FileHashChecker from "../tools/file-hash-checker";
import DnsLeakTest from "../tools/dns-leak-test";
import BrowserFingerprint from "../tools/browser-fingerprint";

export default function ToolsSection() {
  return (
    <section id="tools" className="py-16 bg-dark-bg">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-display font-bold text-white mb-2 text-center">Security Tools</h2>
        <p className="text-muted-text text-center mb-12">Essential cybersecurity utilities for your digital protection</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <PasswordGenerator />
          <PasswordStrength />
          <UrlWhoisCombo /> {/* URL Scanner with WHOIS data */}
          <EncryptionTool />
          <FileHashChecker />
          <DnsLeakTest />
          <BrowserFingerprint />
        </div>
      </div>
    </section>
  );
}