"use client";

import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { ref, set, get, update, remove } from 'firebase/database';

function generateQueueId() {
  return Math.random().toString(36).substring(2, 10);
}

function generateUserId() {
  return Math.random().toString(36).substring(2, 10);
}

export default function Home() {
  const [firebaseStatus, setFirebaseStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [dbValue, setDbValue] = useState<string | null>(null);
  const [queueId, setQueueId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Join queue state
  const [joinQueueId, setJoinQueueId] = useState("");
  const [joinName, setJoinName] = useState("");
  const [joinStatus, setJoinStatus] = useState<null | 'success' | 'error'>(null);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [joinedUserId, setJoinedUserId] = useState<string | null>(null);

  // Leave/reset state
  const [leaveStatus, setLeaveStatus] = useState<null | 'success' | 'error'>(null);
  const [leaveError, setLeaveError] = useState<string | null>(null);
  const [resetStatus, setResetStatus] = useState<null | 'success' | 'error'>(null);
  const [resetError, setResetError] = useState<string | null>(null);

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

  const handleJoinQueue = async (e: React.FormEvent) => {
    e.preventDefault();
    setJoinStatus(null);
    setJoinError(null);
    setJoinedUserId(null);
    if (!joinQueueId || !joinName) {
      setJoinError('Queue ID and name are required.');
      return;
    }
    const queueRef = ref(db, `queues/${joinQueueId}`);
    const snapshot = await get(queueRef);
    if (!snapshot.exists()) {
      setJoinStatus('error');
      setJoinError('Queue not found.');
      return;
    }
    const userId = generateUserId();
    const entryRef = ref(db, `queues/${joinQueueId}/entries/${userId}`);
    try {
      await set(entryRef, { name: joinName, joinedAt: Date.now() });
      setJoinStatus('success');
      setJoinedUserId(userId);
    } catch (err) {
      setJoinStatus('error');
      setJoinError('Failed to join queue.');
    }
  };

  const handleLeaveQueue = async () => {
    setLeaveStatus(null);
    setLeaveError(null);
    if (!joinQueueId || !joinedUserId) {
      setLeaveStatus('error');
      setLeaveError('Missing queue ID or user ID.');
      return;
    }
    const entryRef = ref(db, `queues/${joinQueueId}/entries/${joinedUserId}`);
    try {
      await remove(entryRef);
      setLeaveStatus('success');
      setJoinedUserId(null);
    } catch (err) {
      setLeaveStatus('error');
      setLeaveError('Failed to leave queue.');
    }
  };

  const handleResetQueue = async () => {
    setResetStatus(null);
    setResetError(null);
    if (!joinQueueId) {
      setResetStatus('error');
      setResetError('Missing queue ID.');
      return;
    }
    const entriesRef = ref(db, `queues/${joinQueueId}/entries`);
    try {
      await set(entriesRef, {});
      setResetStatus('success');
    } catch (err) {
      setResetStatus('error');
      setResetError('Failed to reset queue.');
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

      <form className="mt-12 flex flex-col items-center gap-2" onSubmit={handleJoinQueue}>
        <h2 className="text-lg font-semibold mb-2">Join a Queue</h2>
        <input
          className="border px-2 py-1 rounded"
          type="text"
          placeholder="Queue ID"
          value={joinQueueId}
          onChange={e => setJoinQueueId(e.target.value)}
        />
        <input
          className="border px-2 py-1 rounded"
          type="text"
          placeholder="Your Name"
          value={joinName}
          onChange={e => setJoinName(e.target.value)}
        />
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-2"
          type="submit"
        >
          Join Queue
        </button>
        {joinStatus === 'success' && (
          <div className="mt-2 text-green-600">Joined queue! Your user ID: <span className="font-mono">{joinedUserId}</span></div>
        )}
        {joinStatus === 'error' && joinError && (
          <div className="mt-2 text-red-600">{joinError}</div>
        )}
      </form>

      <div className="mt-8 flex flex-col items-center gap-2">
        <button
          className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
          onClick={handleLeaveQueue}
          disabled={!joinedUserId}
        >
          Leave Queue
        </button>
        {leaveStatus === 'success' && (
          <div className="text-yellow-600">You have left the queue.</div>
        )}
        {leaveStatus === 'error' && leaveError && (
          <div className="text-red-600">{leaveError}</div>
        )}
        <button
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mt-2"
          onClick={handleResetQueue}
          disabled={!joinQueueId}
        >
          Reset Queue (Clear All Entries)
        </button>
        {resetStatus === 'success' && (
          <div className="text-red-600">Queue has been reset.</div>
        )}
        {resetStatus === 'error' && resetError && (
          <div className="text-red-600">{resetError}</div>
        )}
      </div>
    </main>
  );
}
