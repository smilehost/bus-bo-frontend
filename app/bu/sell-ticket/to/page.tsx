'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ToStationPicker() {
  const [search, setSearch] = useState('');
  const router = useRouter();
  const stations = ['มหาสารคาม', 'มหาสารคาม', 'มหาสารคาม'];

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">ถึง</h1>
      <input
        type="text"
        placeholder="มหาสารคาม"
        className="w-full border p-2 rounded mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="space-y-2">
        {stations.map((s, i) => (
          <button
            key={i}
            className="w-full border p-2 rounded flex items-center"
            onClick={() => router.push('/bu/sell-ticket/result')}
          >
            <span className="material-icons mr-2">train</span>
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
