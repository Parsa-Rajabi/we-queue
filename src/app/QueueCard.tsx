"use client";
import React from "react";

type QueueCardProps = {
  name: string;
  userId: string;
  joinedAt: number;
};

export default function QueueCard({ name, userId, joinedAt }: QueueCardProps) {
  const formattedTime = new Date(joinedAt).toLocaleTimeString();
  return (
    <div className="flex justify-between items-center p-2 border-b border-gray-800 last:border-b-0">
      <div>
        <span className="font-mono text-base">{name}</span>
        <span className="ml-2 text-xs text-gray-500">({userId})</span>
      </div>
      <span className="text-xs text-gray-400">{formattedTime}</span>
    </div>
  );
} 