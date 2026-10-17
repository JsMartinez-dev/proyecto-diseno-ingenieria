import { useState } from 'react';
import { useApp } from '@/store/AppContext';
import { demoAccounts, passwordDigest, saveDemoAccounts } from '@/store/demoAuth';
import type { Role } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function DemoAccess({ onBack }: { onBack: () => void }) {
  const { setRole, personalizeDemo } = useApp();
  const [mode, setMode] = useState<'login' | 'register' | 'recover'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [accountRole, setAccountRole] = useState<'cliente' | 'prestador'>('cliente');
  const [consent, setConsent] = useState(false);
  const [challenge, setChallenge] = useState<{ email: string; code: string; expires: number }>();
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const changeMode = (next: typeof mode) => { setMode(next); setStatus(''); setError(''); setPassword(''); setChallenge(undefined); setCode(''); };
  async function submit() {
    setError(''); setStatus(''); setBusy(true);
    try {
      const accounts = await demoAccounts();
      const normalized = email.trim().toLowerCase();
      const account = accounts.find(a => a.email === normalized);
      if (mode === 'register') {
        if (!name.trim() || !consent || password.length < 8) throw new Error('Completa el nombre, una contraseña de al menos 8 caracteres y el consentimiento.');
        if (account) throw new Error('Ese correo ya está registrado.');
        const salt = crypto.randomUUID();
        const digest = await passwordDigest(password, salt);
        saveDemoAccounts([...accounts.filter(a => a.role !== accountRole), { email: normalized, name: name.trim(), role: accountRole, salt, digest }]);
        personalizeDemo(accountRole, name.trim()); setRole(accountRole);
      } else if (mode === 'login') {
        if (!account || await passwordDigest(password, account.salt) !== account.digest) throw new Error('Correo o contraseña incorrectos.');
        setRole(account.role);
      } else if (!challenge) {
        if (!account) throw new Error('No hay una cuenta de ejemplo con ese correo.');
        const recoveryCode = String(crypto.getRandomValues(new Uint32Array(1))[0] % 1000000).padStart(6, '0');
        setChallenge({ email: normalized, code: recoveryCode, expires: Date.now() + 5 * 60 * 1000 });
      } else {
        if (challenge.email !== normalized || code !== challenge.code || Date.now() > challenge.expires) throw new Error('El código no es válido o expiró. Solicita uno nuevo.');
        if (!account || password.length < 8) throw new Error('Usa una contraseña de al menos 8 caracteres.');
        const salt = crypto.randomUUID(); const digest = await passwordDigest(password, salt);
        saveDemoAccounts(accounts.map(a => a.email !== normalized ? a : { ...a, salt, digest }));
        setChallenge(undefined); setCode(''); setPassword(''); setMode('login'); setStatus('Contraseña actualizada. Ya puedes iniciar sesión.');
      }
    } catch (err) { setError(err instanceof Error ? err.message : 'No se pudo completar la operación.'); }
    finally { setBusy(false); }
  }
  return <div className="min-h-screen bg-blue-900 px-4 py-10"><div className="max-w-lg mx-auto">
    <h1 className="text-white text-2xl font-bold mb-2 text-center">ALIADO</h1>
    <p className="text-blue-100 text-sm text-center mb-6">Acceso a la demostración académica</p>
    <Card className="p-5 space-y-4">
      <div className="flex gap-2 flex-wrap">{([['login', 'Iniciar sesión'], ['register', 'Registrarme'], ['recover', 'Recuperar acceso']] as const).map(([value, label]) => <button key={value} onClick={() => changeMode(value)} aria-pressed={mode === value} className={`px-3 py-2 rounded-lg text-sm ${mode === value ? 'bg-blue-700 text-white' : 'bg-gray-100'}`}>{label}</button>)}</div>
      <p className="text-xs text-gray-500">Usa datos ficticios. Registro y recuperación se simulan en este navegador. El registro personaliza y reemplaza la cuenta de acceso de ejemplo del rol elegido.</p>
      <form className="space-y-3" onSubmit={e => { e.preventDefault(); void submit(); }}>
        {mode === 'register' && <><label className="block text-sm">Nombre<input required value={name} onChange={e => setName(e.target.value)} className="block w-full border rounded-xl p-3" /></label><label className="block text-sm">Quiero usar ALIADO como<select value={accountRole} onChange={e => setAccountRole(e.target.value as typeof accountRole)} className="block w-full border rounded-xl p-3"><option value="cliente">Cliente</option><option value="prestador">Prestador</option></select></label></>}
        <label className="block text-sm">Correo de ejemplo<input type="email" required value={email} disabled={!!challenge} onChange={e => setEmail(e.target.value)} className="block w-full border rounded-xl p-3" /></label>
        {(mode !== 'recover' || challenge) && <label className="block text-sm">{mode === 'recover' ? 'Nueva contraseña' : 'Contraseña'}<input type="password" required minLength={mode === 'login' ? 1 : 8} value={password} onChange={e => setPassword(e.target.value)} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} className="block w-full border rounded-xl p-3" /></label>}
        {mode === 'register' && <><details className="text-sm"><summary className="cursor-pointer text-blue-700">Leer términos y tratamiento de datos</summary><p className="mt-2">Versión demo 1. Los datos de ejemplo se guardan en el navegador para mostrar contratación de servicios. La zona se usa para compatibilidad y la dirección solo se muestra tras contratar. Puedes consultar tus datos y solicitar eliminación desde Mi perfil. No se envían correos ni se presta un servicio real.</p></details><label className="flex items-start gap-3 text-sm"><input type="checkbox" required checked={consent} onChange={e => setConsent(e.target.checked)} className="mt-1" />Acepto los términos y el tratamiento de los datos de ejemplo.</label></>}
        {challenge && <div className="space-y-2"><p role="status" className="text-sm bg-blue-50 p-3 rounded-xl">Correo simulado para {challenge.email}: tu código es <strong>{challenge.code}</strong>. Válido durante 5 minutos.</p><label className="block text-sm">Código de recuperación<input required value={code} onChange={e => setCode(e.target.value)} className="block w-full border rounded-xl p-3" /></label><button type="button" onClick={() => { setChallenge(undefined); setCode(''); }} className="text-sm underline text-blue-700">Solicitar otro código</button></div>}
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}{status && <p role="status" className="text-sm text-green-700">{status}</p>}
        <Button type="submit" fullWidth disabled={busy}>{busy ? 'Procesando…' : mode === 'register' ? 'Crear cuenta de ejemplo' : mode === 'login' ? 'Iniciar sesión' : challenge ? 'Cambiar contraseña' : 'Solicitar código'}</Button>
      </form>
      <details className="text-sm"><summary className="cursor-pointer text-blue-700">Credenciales iniciales de ejemplo</summary><p className="mt-2">cliente@aliado.demo · prestador@aliado.demo · admin@aliado.demo</p><p>Contraseña: Aliado123!</p><p className="text-xs text-gray-500">El registro reemplaza las credenciales iniciales del rol.</p></details>
      <div className="border-t pt-4 space-y-2"><p className="text-sm font-semibold">Acceso rápido para presentar</p><div className="flex flex-wrap gap-2">{(['cliente','prestador','admin'] as Role[]).map(r => <Button key={r} variant="secondary" onClick={() => setRole(r)}>{r === 'cliente' ? 'Cliente' : r === 'prestador' ? 'Prestador' : 'Administrador'}</Button>)}</div></div>
      <Button fullWidth variant="ghost" onClick={onBack}>Volver al inicio</Button>
    </Card>
  </div></div>;
}
