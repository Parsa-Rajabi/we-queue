"use client";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, onValue, off, get, DataSnapshot } from "firebase/database";
import QueueList from "./QueueList";

export default function QueueView({ code, onBack }: { code: string; onBack: () => void }) {
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
        <button className="mt-2 px-4 py-2 bg-teal-400 rounded text-black font-bold" onClick={onBack}>Back</button>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-900">
      <h2 className="text-2xl font-bold mb-4">Queue: <span className="font-mono">{code}</span></h2>
      <QueueList entries={entries} />
      <button className="mt-8 px-4 py-2 bg-teal-400 rounded text-black font-bold" onClick={onBack}>Back</button>
    </div>
  );
} 