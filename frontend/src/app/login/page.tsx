"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('staff');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error('Login failed');
      const data = await res.json();
      localStorage.setItem('token', data.access_token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Error');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 bg-neutral-900 border border-neutral-800 p-6 rounded">
        <h1 className="text-xl font-semibold">Front Desk Login</h1>
        <div>
          <label className="block text-sm mb-1">Username</label>
            <input className="w-full px-3 py-2 rounded bg-neutral-800 border border-neutral-700" value={username} onChange={e=>setUsername(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
            <input type="password" className="w-full px-3 py-2 rounded bg-neutral-800 border border-neutral-700" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button className="w-full py-2 rounded bg-blue-600 hover:bg-blue-500 text-sm font-medium" type="submit">Login</button>
        <p className="text-xs text-neutral-400">Default: staff / password</p>
      </form>
    </div>
  );
}
