import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
};

export function generateRandomPassword(
  length: number,
  includeUppercase: boolean,
  includeLowercase: boolean,
  includeNumbers: boolean,
  includeSymbols: boolean
): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
  
  let characters = '';
  if (includeUppercase) characters += uppercase;
  if (includeLowercase) characters += lowercase;
  if (includeNumbers) characters += numbers;
  if (includeSymbols) characters += symbols;
  
  if (characters === '') {
    characters = lowercase + numbers; // Default fallback
  }
  
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }
  
  return password;
}

export function checkPasswordStrength(password: string): {
  score: number;
  strength: 'weak' | 'fair' | 'good' | 'strong';
  feedback: string[];
  crackTime: string;
} {
  if (!password) {
    return {
      score: 0,
      strength: 'weak',
      feedback: ['Enter a password to check its strength'],
      crackTime: 'instantly'
    };
  }

  // Check length
  const length = password.length;
  let score = 0;
  const feedback: string[] = [];

  // Basic scoring
  if (length < 8) {
    score += 1;
    feedback.push('Password is too short');
  } else if (length < 12) {
    score += 2;
    feedback.push('Increase length (16+ characters recommended)');
  } else if (length < 16) {
    score += 3;
  } else {
    score += 4;
  }

  // Check character variety
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSymbols = /[^A-Za-z0-9]/.test(password);

  if (!hasUppercase) feedback.push('Add uppercase letters');
  if (!hasLowercase) feedback.push('Add lowercase letters');
  if (!hasNumbers) feedback.push('Add numbers');
  if (!hasSymbols) feedback.push('Add symbols');

  score += (hasUppercase ? 1 : 0) + 
           (hasLowercase ? 1 : 0) + 
           (hasNumbers ? 1 : 0) + 
           (hasSymbols ? 1 : 0);

  // Check for common patterns
  const hasRepeatedChars = /(.)\1{2,}/.test(password);
  const hasSequential = /(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i.test(password);
  
  if (hasRepeatedChars) {
    score -= 1;
    feedback.push('Avoid repeated characters');
  }
  
  if (hasSequential) {
    score -= 1;
    feedback.push('Avoid sequential patterns');
  }

  // Normalize score to 0-8 range
  score = Math.max(0, Math.min(8, score));

  // Map score to strength and crack time
  let strength: 'weak' | 'fair' | 'good' | 'strong' = 'weak';
  let crackTime = 'instantly';

  if (score <= 2) {
    strength = 'weak';
    crackTime = 'instantly';
  } else if (score <= 4) {
    strength = 'fair';
    crackTime = '3 weeks, 4 days';
  } else if (score <= 6) {
    strength = 'good';
    crackTime = '5 years';
  } else {
    strength = 'strong';
    crackTime = 'centuries';
  }

  return { score, strength, feedback, crackTime };
}

export function parseUserAgent(userAgent: string) {
  // Browser
  let browser = "Unknown";
  if (userAgent.includes("Firefox/")) {
    browser = "Firefox " + userAgent.split("Firefox/")[1].split(" ")[0];
  } else if (userAgent.includes("Edg/")) {
    browser = "Edge " + userAgent.split("Edg/")[1].split(" ")[0];
  } else if (userAgent.includes("Chrome/")) {
    browser = "Chrome " + userAgent.split("Chrome/")[1].split(" ")[0];
  } else if (userAgent.includes("Safari/") && !userAgent.includes("Chrome")) {
    let version = "Unknown";
    if (userAgent.includes("Version/")) {
      version = userAgent.split("Version/")[1].split(" ")[0];
    }
    browser = "Safari " + version;
  } else if (userAgent.includes("OPR/") || userAgent.includes("Opera/")) {
    const match = userAgent.match(/(?:OPR|Opera)[/](\d+\.\d+)/);
    browser = "Opera " + (match ? match[1] : "");
  }

  // OS
  let os = "Unknown";
  if (userAgent.includes("Windows NT")) {
    const ntVersion = userAgent.match(/Windows NT (\d+\.\d+)/);
    const versionMap: { [key: string]: string } = {
      '10.0': 'Windows 10',
      '6.3': 'Windows 8.1',
      '6.2': 'Windows 8',
      '6.1': 'Windows 7',
      '6.0': 'Windows Vista',
      '5.2': 'Windows XP x64',
      '5.1': 'Windows XP'
    };
    os = ntVersion ? (versionMap[ntVersion[1]] || `Windows (NT ${ntVersion[1]})`) : "Windows";
  } else if (userAgent.includes("Macintosh")) {
    os = "macOS";
  } else if (userAgent.includes("Linux")) {
    os = "Linux";
  } else if (userAgent.includes("Android")) {
    os = "Android";
  } else if (userAgent.includes("iOS") || userAgent.includes("iPhone") || userAgent.includes("iPad")) {
    os = "iOS";
  }

  // Device type
  let device = "Desktop";
  if (userAgent.includes("Mobile")) {
    device = "Mobile";
  } else if (userAgent.includes("Tablet") || userAgent.includes("iPad")) {
    device = "Tablet";
  }

  // Screen size
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  const screenResolution = `${screenWidth} x ${screenHeight}`;

  // Language
  const language = navigator.language || "Unknown";

  // Timezone
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown";
  const timezoneOffset = new Date().getTimezoneOffset();
  const hours = Math.abs(Math.floor(timezoneOffset / 60));
  const minutes = Math.abs(timezoneOffset % 60);
  const formattedOffset = `GMT${timezoneOffset <= 0 ? '+' : '-'}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  const formattedTimezone = `${timezone} (${formattedOffset})`;

  return {
    userAgent,
    browser,
    os,
    device,
    screenResolution,
    language,
    timezone: formattedTimezone
  };
}

export const getWebRTCData = async (): Promise<{localIp: string | null}> => {
  try {
    const RTCPeerConnection = window.RTCPeerConnection;
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });
    
    return new Promise((resolve) => {
      let localIp: string | null = null;
      const timeoutId = setTimeout(() => resolve({localIp}), 5000);
      
      pc.createDataChannel('');
      pc.createOffer().then(offer => pc.setLocalDescription(offer));
      
      pc.onicecandidate = (ice) => {
        if (!ice || !ice.candidate || !ice.candidate.candidate) return;
        
        const candidateString = ice.candidate.candidate;
        const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/;
        const match = ipRegex.exec(candidateString);
        
        if (match) {
          localIp = match[1];
          clearTimeout(timeoutId);
          pc.close();
          resolve({localIp});
        }
      };
    });
  } catch (e) {
    console.error('WebRTC test failed:', e);
    return {localIp: null};
  }
};
