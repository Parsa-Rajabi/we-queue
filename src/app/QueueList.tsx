"use client";
import React from "react";
import QueueCard from "./QueueCard";

type QueueListProps = {
  entries: { [userId: string]: { name: string; joinedAt: number } };
};

export default function QueueList({ entries }: QueueListProps) {
  const entryList = Object.entries(entries);
  return (
    <div className="mt-8 w-full max-w-md">
      <h3 className="text-lg font-semibold mb-2 text-center">Current Queue</h3>
      <ul className="bg-gray-900 rounded p-4">
        {entryList.length === 0 && (
          <li className="text-gray-400">Queue is empty.</li>
        )}
        {entryList.map(([userId, entry]) => (
          <li key={userId}>
            <QueueCard name={entry.name} userId={userId} joinedAt={entry.joinedAt} />
          </li>
        ))}
      </ul>
    </div>
  );
} 