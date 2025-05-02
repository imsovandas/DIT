import { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { checkPasswordStrength } from "@/lib/utils";

export default function PasswordStrength() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState<{
    score: number;
    strength: 'weak' | 'fair' | 'good' | 'strong';
    feedback: string[];
    crackTime: string;
  }>({
    score: 0,
    strength: 'weak',
    feedback: ['Enter a password to check its strength'],
    crackTime: 'instantly'
  });

  useEffect(() => {
    const result = checkPasswordStrength(password);
    setStrength(result);
  }, [password]);

  // Get the appropriate strength class
  const getStrengthClass = () => {
    switch (strength.strength) {
      case 'weak': return 'strength-weak';
      case 'fair': return 'strength-fair';
      case 'good': return 'strength-good';
      case 'strong': return 'strength-strong';
      default: return '';
    }
  };

  // Get the appropriate text color
  const getTextColor = () => {
    switch (strength.strength) {
      case 'weak': return 'text-red-500';
      case 'fair': return 'text-yellow-400';
      case 'good': return 'text-yellow-200';
      case 'strong': return 'text-green-400';
      default: return 'text-muted-text';
    }
  };

  return (
    <div className="tool-card bg-dark-card rounded-lg overflow-hidden border border-gray-800 h-full">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-display font-medium text-white">Password Strength</h3>
          <div className="bg-[rgba(19,136,8,0.1)] p-2 rounded">
            <CheckCircle className="h-5 w-5 text-indian-green" />
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="password-check" className="block text-xs text-muted-text mb-1">Enter Password</label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              id="password-check"
              className="cyber-input w-full bg-dark-bg p-3 rounded text-light-text mb-4 pr-10"
              placeholder="Enter password to check"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-muted-text hover:text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                  <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-text">Strength</span>
              <span className={getTextColor()}>{strength.strength.charAt(0).toUpperCase() + strength.strength.slice(1)}</span>
            </div>
            <div className="password-meter">
              <div className={`password-strength ${getStrengthClass()}`} style={{ width: password ? undefined : '0%' }}></div>
            </div>
          </div>
          <div className="text-xs text-muted-text mb-2">Estimated crack time:</div>
          <div className="cyber-input bg-dark-bg p-3 rounded mb-2">
            <div className={`font-mono text-sm ${getTextColor()}`}>{strength.crackTime}</div>
          </div>
          
          {password && (
            <div className={`bg-${strength.strength === 'weak' ? 'red' : strength.strength === 'fair' ? 'yellow' : 'green'}-900/20 border border-${strength.strength === 'weak' ? 'red' : strength.strength === 'fair' ? 'yellow' : 'green'}-700/30 rounded p-3`}>
              <h4 className={`text-xs font-medium ${getTextColor()} mb-1`}>Suggestions:</h4>
              <ul className="text-xs text-muted-text list-disc list-inside space-y-1">
                {strength.feedback.length > 0 ? (
                  strength.feedback.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))
                ) : (
                  <li>Your password is strong!</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
