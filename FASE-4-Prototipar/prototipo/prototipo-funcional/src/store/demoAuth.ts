import type { Role } from '../types';
export interface DemoAccount { email: string; name: string; role: Role; salt: string; digest: string }
const key = 'aliado-v1-accounts';
export async function passwordDigest(password: string, salt: string) {
  const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: new TextEncoder().encode(salt), iterations: 100000, hash: 'SHA-256' }, material, 256);
  return Array.from(new Uint8Array(bits), b => b.toString(16).padStart(2, '0')).join('');
}
export async function demoAccounts(): Promise<DemoAccount[]> {
  const saved = localStorage.getItem(key);
  if (saved) return JSON.parse(saved);
  const salt = 'aliado-academic-demo';
  const digest = await passwordDigest('Aliado123!', salt);
  return [
    { email: 'cliente@aliado.demo', name: 'Patricia Mercado', role: 'cliente', salt, digest },
    { email: 'prestador@aliado.demo', name: 'Jorge Ortiz', role: 'prestador', salt, digest },
    { email: 'admin@aliado.demo', name: 'Administrador', role: 'admin', salt, digest },
  ];
}
export function saveDemoAccounts(accounts: DemoAccount[]) { localStorage.setItem(key, JSON.stringify(accounts)); }
