"use client";
import { useState } from "react";
import LandingJoin from "./LandingJoin";

// Placeholder for QueueView
function QueueView({ code }: { code: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-900">
      <h2 className="text-2xl font-bold mb-4">Queue: <span className="font-mono">{code}</span></h2>
      <p className="text-lg">(QueueView coming soon...)</p>
    </div>
  );
}

export default function Home() {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [joined, setJoined] = useState(false);

  // Simulate code validation (replace with real Firebase check later)
  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 4) {
      setError("Please enter a valid 4-character code.");
      return;
    }
    setError(null);
    setJoined(true);
  };

  if (joined) {
    return <QueueView code={code} />;
  }

  return (
    <LandingJoin
      code={code}
      onCodeChange={setCode}
      onJoin={handleJoin}
      error={error}
    />
  );
}
