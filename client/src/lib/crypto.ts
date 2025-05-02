import CryptoJS from 'crypto-js';

export interface CryptoOptions {
  algorithm: 'AES' | 'DES' | 'TripleDES' | 'Rabbit' | 'RC4' | 'RC4Drop' | 'Base64' | 'SHA256' | 'SHA512' | 'SHA1' | 'SHA3' | 'MD5';
  mode: 'encrypt' | 'decrypt' | 'hash';
  key?: string;
}

export async function encryptData(text: string, options: CryptoOptions): Promise<string> {
  if (!text) return '';
  
  try {
    switch (options.algorithm) {
      case 'AES':
        return CryptoJS.AES.encrypt(text, options.key || 'defaultKey').toString();
      case 'DES':
        return CryptoJS.DES.encrypt(text, options.key || 'defaultKey').toString();
      case 'TripleDES':
        return CryptoJS.TripleDES.encrypt(text, options.key || 'defaultKey').toString();
      case 'Rabbit':
        return CryptoJS.Rabbit.encrypt(text, options.key || 'defaultKey').toString();
      case 'RC4':
        return CryptoJS.RC4.encrypt(text, options.key || 'defaultKey').toString();
      case 'RC4Drop':
        return CryptoJS.RC4Drop.encrypt(text, options.key || 'defaultKey').toString();
      case 'Base64':
        return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text));
      default:
        throw new Error('Unsupported encryption algorithm');
    }
  } catch (error) {
    console.error('Encryption error:', error);
    throw error;
  }
}

export async function decryptData(text: string, options: CryptoOptions): Promise<string> {
  if (!text) return '';
  
  try {
    switch (options.algorithm) {
      case 'AES':
        return CryptoJS.AES.decrypt(text, options.key || 'defaultKey').toString(CryptoJS.enc.Utf8);
      case 'DES':
        return CryptoJS.DES.decrypt(text, options.key || 'defaultKey').toString(CryptoJS.enc.Utf8);
      case 'TripleDES':
        return CryptoJS.TripleDES.decrypt(text, options.key || 'defaultKey').toString(CryptoJS.enc.Utf8);
      case 'Rabbit':
        return CryptoJS.Rabbit.decrypt(text, options.key || 'defaultKey').toString(CryptoJS.enc.Utf8);
      case 'RC4':
        return CryptoJS.RC4.decrypt(text, options.key || 'defaultKey').toString(CryptoJS.enc.Utf8);
      case 'RC4Drop':
        return CryptoJS.RC4Drop.decrypt(text, options.key || 'defaultKey').toString(CryptoJS.enc.Utf8);
      case 'Base64':
        return CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(text));
      default:
        throw new Error('Unsupported decryption algorithm');
    }
  } catch (error) {
    console.error('Decryption error:', error);
    throw error;
  }
}

export function hashData(text: string, algorithm: string): string {
  if (!text) return '';

  try {
    switch (algorithm) {
      case 'MD5':
        return CryptoJS.MD5(text).toString();
      case 'SHA1':
        return CryptoJS.SHA1(text).toString();
      case 'SHA256':
        return CryptoJS.SHA256(text).toString();
      case 'SHA512':
        return CryptoJS.SHA512(text).toString();
      case 'SHA3':
        return CryptoJS.SHA3(text).toString();
      default:
        throw new Error('Unsupported hash algorithm');
    }
  } catch (error) {
    console.error('Hashing error:', error);
    throw new Error('Failed to hash data');
  }
}

export async function computeFileHash(file: File, algorithm: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result;
        if (!content) {
          reject(new Error('Failed to read file'));
          return;
        }
        
        let hash = '';
        switch (algorithm) {
          case 'MD5':
            hash = CryptoJS.MD5(CryptoJS.lib.WordArray.create(content as ArrayBuffer)).toString();
            break;
          case 'SHA1':
            hash = CryptoJS.SHA1(CryptoJS.lib.WordArray.create(content as ArrayBuffer)).toString();
            break;
          case 'SHA256':
            hash = CryptoJS.SHA256(CryptoJS.lib.WordArray.create(content as ArrayBuffer)).toString();
            break;
          case 'SHA512':
            hash = CryptoJS.SHA512(CryptoJS.lib.WordArray.create(content as ArrayBuffer)).toString();
            break;
          default:
            reject(new Error('Unsupported hash algorithm'));
            return;
        }
        
        resolve(hash);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsArrayBuffer(file);
  });
}
