"use client";
import { useEffect, useState } from 'react';

interface QueueEntry { id: number; patientName: string; queueNumber: number; status: string; priority: number; }
interface Appointment { id: number; patientName: string; time: string; status: string; doctor: { id: number; name: string; specialization: string }; }

const api = (path: string, options: RequestInit = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001') + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
};

export default function DashboardPage() {
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const [qRes, aRes] = await Promise.all([
      api('/queue'),
      api('/appointments'),
    ]);
    setQueue(await qRes.json());
    setAppointments(await aRes.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-semibold">Front Desk Dashboard</h1>
      {loading && <p>Loading...</p>}
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="font-medium mb-2">Queue Management</h2>
          <div className="space-y-2">
            {queue.map(item => (
              <div key={item.id} className="p-3 rounded border border-neutral-800 bg-neutral-900 flex justify-between text-sm">
                <div>
                  <p className="font-medium">#{item.queueNumber} {item.patientName} {item.priority===0 && <span className='text-red-400 ml-2'>URGENT</span>}</p>
                  <p className="text-xs text-neutral-400">Status: {item.status}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <select className="bg-neutral-800 text-xs p-1 rounded" value={item.status} onChange={async e=>{await api(`/queue/${item.id}/status`, {method:'PATCH', body: JSON.stringify({status: e.target.value})}); load();}}>
                    <option value="WAITING">Waiting</option>
                    <option value="WITH_DOCTOR">With Doctor</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="font-medium mb-2">Appointments</h2>
          <div className="space-y-2">
            {appointments.map(a => (
              <div key={a.id} className="p-3 rounded border border-neutral-800 bg-neutral-900 text-sm flex justify-between">
                <div>
                  <p className="font-medium">{a.patientName}</p>
                  <p className="text-xs text-neutral-400">{new Date(a.time).toLocaleString()} – {a.doctor?.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <select className="bg-neutral-800 text-xs p-1 rounded" value={a.status} onChange={async e=>{await api(`/appointments/${a.id}/status`, {method:'PATCH', body: JSON.stringify({status: e.target.value})}); load();}}>
                    <option value="BOOKED">Booked</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELED">Canceled</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
