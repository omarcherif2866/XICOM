import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  private secretKey = environment.encryptionKey;

  encrypt(data: any): string {
    try {
      const text = JSON.stringify(data);
      const encoded = encodeURIComponent(text);
      // XOR simple + base64
      const xored = this.xorEncrypt(encoded, this.secretKey);
      return btoa(xored);
    } catch (e) {
      console.error('Encrypt error:', e);
      return '';
    }
  }

  decrypt(encryptedData: string): any {
    try {
      const xored = atob(encryptedData);
      const encoded = this.xorEncrypt(xored, this.secretKey); // XOR est réversible
      const text = decodeURIComponent(encoded);
      return JSON.parse(text);
    } catch (e) {
      console.error('Decrypt error:', e);
      return null;
    }
  }

  private xorEncrypt(text: string, key: string): string {
    return text.split('').map((char, i) =>
      String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length))
    ).join('');
  }
}