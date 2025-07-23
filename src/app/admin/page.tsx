"use client";
import { useState } from "react";
import { db } from "../../firebase";
import { ref, set } from "firebase/database";
import QRCode from "../QRCode";

function generateQueueId() {
  // 4-character alphanumeric code
  return Math.random().toString(36).substring(2, 6).toUpperCase();
}

export default function AdminPage() {
  const [queueId, setQueueId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateQueue = async () => {
    setCreating(true);
    setError(null);
    const newQueueId = generateQueueId();
    const queueRef = ref(db, `queues/${newQueueId}`);
    const queueData = {
      createdAt: Date.now(),
      entries: {},
      admin: true, // simple flag for now
    };
    try {
      await set(queueRef, queueData);
      setQueueId(newQueueId);
    } catch (err) {
      setError("Failed to create queue.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-900">
      <h1 className="text-2xl font-bold mb-8 mt-8">Admin: Create a New Queue</h1>
      {!queueId ? (
        <button
          className="bg-teal-400 hover:bg-teal-500 text-black font-bold py-2 px-8 rounded text-lg transition-colors"
          onClick={handleCreateQueue}
          disabled={creating}
        >
          {creating ? "Creating..." : "Create New Queue"}
        </button>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <div className="text-lg">Queue code:</div>
          <div className="text-3xl font-mono font-bold text-teal-600">{queueId}</div>
          <div className="mt-4">
            <QRCode value={`https://yourdomain.com/?code=${queueId}`} />
          </div>
          <div className="mt-4">[Admin controls coming soon]</div>
        </div>
      )}
      {error && <div className="mt-4 text-red-600">{error}</div>}
    </div>
  );
} 