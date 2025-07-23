"use client";

import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { ref, set, get } from 'firebase/database';

function generateQueueId() {
  return Math.random().toString(36).substring(2, 10);
}

export default function Home() {
  const [firebaseStatus, setFirebaseStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [dbValue, setDbValue] = useState<string | null>(null);
  const [queueId, setQueueId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

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

  const handleCreateQueue = async () => {
    setCreating(true);
    setCreateError(null);
    const newQueueId = generateQueueId();
    const queueRef = ref(db, `queues/${newQueueId}`);
    const queueData = {
      createdAt: Date.now(),
      entries: {},
    };
    try {
      await set(queueRef, queueData);
      setQueueId(newQueueId);
    } catch (err) {
      setCreateError('Failed to create queue.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold mb-4">We Queue</h1>
      <div className="mt-8 mb-8">
        <p>Firebase connection status: <span className="font-mono">{firebaseStatus}</span></p>
        {firebaseStatus === 'success' && <p>Test value from DB: <span className="font-mono">{dbValue}</span></p>}
        {firebaseStatus === 'error' && <p className="text-red-500">Failed to connect to Firebase Realtime Database.</p>}
      </div>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        onClick={handleCreateQueue}
        disabled={creating}
      >
        {creating ? 'Creating Queue...' : 'Create New Queue'}
      </button>
      {queueId && (
        <div className="mt-4 text-green-600">Queue created! ID: <span className="font-mono">{queueId}</span></div>
      )}
      {createError && (
        <div className="mt-4 text-red-600">{createError}</div>
      )}
    </main>
  );
}
