"use client";
import React from "react";

type JoinFormProps = {
  queueId: string;
  name: string;
  onQueueIdChange: (v: string) => void;
  onNameChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  status: null | 'success' | 'error';
  error: string | null;
  userId: string | null;
};

export default function JoinForm({
  queueId,
  name,
  onQueueIdChange,
  onNameChange,
  onSubmit,
  status,
  error,
  userId,
}: JoinFormProps) {
  return (
    <form className="mt-12 flex flex-col items-center gap-2" onSubmit={onSubmit}>
      <h2 className="text-lg font-semibold mb-2">Join a Queue</h2>
      <input
        className="border px-2 py-1 rounded"
        type="text"
        placeholder="Queue ID"
        value={queueId}
        onChange={e => onQueueIdChange(e.target.value)}
      />
      <input
        className="border px-2 py-1 rounded"
        type="text"
        placeholder="Your Name"
        value={name}
        onChange={e => onNameChange(e.target.value)}
      />
      <button
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-2"
        type="submit"
      >
        Join Queue
      </button>
      {status === 'success' && (
        <div className="mt-2 text-green-600">Joined queue! Your user ID: <span className="font-mono">{userId}</span></div>
      )}
      {status === 'error' && error && (
        <div className="mt-2 text-red-600">{error}</div>
      )}
    </form>
  );
} 