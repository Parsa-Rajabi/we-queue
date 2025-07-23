"use client";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, onValue, off, remove, set, DataSnapshot } from "firebase/database";

export default function AdminQueueView({ queueId }: { queueId: string }) {
  const [entries, setEntries] = useState<{ [userId: string]: { name: string; joinedAt: number } }>({});
  const [resetting, setResetting] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    const entriesRef = ref(db, `queues/${queueId}/entries`);
    const handleValue = (snapshot: DataSnapshot) => {
      setEntries(snapshot.val() || {});
    };
    onValue(entriesRef, handleValue);
    return () => off(entriesRef, "value", handleValue);
  }, [queueId]);

  const handleRemoveUser = async (userId: string) => {
    setRemoving(userId);
    const entryRef = ref(db, `queues/${queueId}/entries/${userId}`);
    await remove(entryRef);
    setRemoving(null);
  };

  const handleResetQueue = async () => {
    setResetting(true);
    const entriesRef = ref(db, `queues/${queueId}/entries`);
    await set(entriesRef, {});
    setResetting(false);
  };

  return (
    <div className="w-full max-w-md mt-4">
      <h3 className="text-lg font-semibold mb-2 text-center">Current Queue</h3>
      <ul className="bg-gray-100 rounded p-4">
        {Object.entries(entries).length === 0 && (
          <li className="text-gray-400">Queue is empty.</li>
        )}
        {Object.entries(entries).map(([userId, entry], idx) => {
          const joinedAt = entry.joinedAt || 0;
          const now = Date.now();
          const seconds = Math.floor((now - joinedAt) / 1000);
          const mins = Math.floor(seconds / 60);
          const secs = seconds % 60;
          return (
            <li key={userId} className="py-1 border-b border-gray-300 last:border-b-0 flex justify-between items-center">
              <span className="font-mono text-base text-gray-900">{idx + 1}. {entry.name ? entry.name : userId}</span>
              <span className="text-xs text-gray-500 ml-2">{mins}:{secs.toString().padStart(2, '0')} waiting</span>
              <button
                className="ml-4 px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 disabled:opacity-50"
                onClick={() => handleRemoveUser(userId)}
                disabled={removing === userId}
              >
                {removing === userId ? "Removing..." : "Remove"}
              </button>
            </li>
          );
        })}
      </ul>
      <button
        className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-8 rounded text-lg transition-colors disabled:opacity-50"
        onClick={handleResetQueue}
        disabled={resetting}
      >
        {resetting ? "Resetting..." : "Reset Queue"}
      </button>
    </div>
  );
} 