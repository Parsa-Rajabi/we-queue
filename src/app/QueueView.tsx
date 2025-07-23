"use client";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, onValue, off, get, DataSnapshot } from "firebase/database";
import QueueList from "./QueueList";

export default function QueueView({ code, userId, onBack }: { code: string; userId?: string; onBack?: () => void }) {
  const [exists, setExists] = useState<null | boolean>(null);
  const [entries, setEntries] = useState<{ [userId: string]: { name: string; joinedAt: number } }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const queueRef = ref(db, `queues/${code}`);
    get(queueRef).then((snapshot) => {
      setExists(snapshot.exists());
      setLoading(false);
    });
    const entriesRef = ref(db, `queues/${code}/entries`);
    const handleValue = (snapshot: DataSnapshot) => {
      setEntries(snapshot.val() || {});
    };
    onValue(entriesRef, handleValue);
    return () => off(entriesRef, "value", handleValue);
  }, [code]);

  if (loading) {
    return <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-900"><p>Loading...</p></div>;
  }
  if (exists === false) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-900">
        <h2 className="text-2xl font-bold mb-4">Queue Not Found</h2>
        {onBack && <button className="mt-2 px-4 py-2 bg-teal-400 rounded text-black font-bold" onClick={onBack}>Back</button>}
      </div>
    );
  }

  // Sort entries by joinedAt
  const sortedEntries = Object.entries(entries).sort((a, b) => (a[1].joinedAt || 0) - (b[1].joinedAt || 0));
  let userPosition = -1;
  if (userId) {
    userPosition = sortedEntries.findIndex(([id]) => id === userId) + 1;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-900">
      <h2 className="text-2xl font-bold mb-4">Queue: <span className="font-mono">{code}</span></h2>
      <div className="w-full max-w-md mt-4">
        <h3 className="text-lg font-semibold mb-2 text-center">Current Queue</h3>
        <ul className="bg-gray-900 rounded p-4">
          {sortedEntries.length === 0 && (
            <li className="text-gray-400">Queue is empty.</li>
          )}
          {sortedEntries.map(([id, entry], idx) => (
            <li
              key={id}
              className={`py-1 border-b border-gray-800 last:border-b-0 flex justify-between items-center ${userId === id ? "bg-teal-700 text-white rounded" : ""}`}
            >
              <span className="font-mono">{entry.name || id}</span>
              <span className="text-xs text-gray-500">{id}</span>
              {userId === id && (
                <span className="ml-2 text-xs font-bold">You ({idx + 1}{getOrdinal(idx + 1)})</span>
              )}
            </li>
          ))}
        </ul>
        {userId && userPosition > 0 && (
          <div className="mt-4 text-center text-lg font-semibold text-teal-700">You are #{userPosition} in line</div>
        )}
      </div>
      {onBack && <button className="mt-8 px-4 py-2 bg-teal-400 rounded text-black font-bold" onClick={onBack}>Back</button>}
    </div>
  );
}

function getOrdinal(n: number) {
  if (n % 10 === 1 && n % 100 !== 11) return "st";
  if (n % 10 === 2 && n % 100 !== 12) return "nd";
  if (n % 10 === 3 && n % 100 !== 13) return "rd";
  return "th";
} 