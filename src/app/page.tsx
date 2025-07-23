"use client";

import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { ref, set, get } from 'firebase/database';

export default function Home() {
  const [firebaseStatus, setFirebaseStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [dbValue, setDbValue] = useState<string | null>(null);

  useEffect(() => {
    const testRef = ref(db, 'testConnection');
    set(testRef, 'hello world')
      .then(() => get(testRef))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setDbValue(snapshot.val());
          setFirebaseStatus('success');
        } else {
          setFirebaseStatus('error');
        }
      })
      .catch(() => setFirebaseStatus('error'));
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold mb-4">We Queue</h1>
      <div className="mt-8">
        <p>Firebase connection status: <span className="font-mono">{firebaseStatus}</span></p>
        {firebaseStatus === 'success' && <p>Test value from DB: <span className="font-mono">{dbValue}</span></p>}
        {firebaseStatus === 'error' && <p className="text-red-500">Failed to connect to Firebase Realtime Database.</p>}
      </div>
    </main>
  );
}
