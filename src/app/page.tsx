"use client";
import { useState } from "react";
import LandingJoin from "./LandingJoin";
import QueueView from "./QueueView";

export default function Home() {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [joined, setJoined] = useState(false);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 4) {
      setError("Please enter a valid 4-character code.");
      return;
    }
    setError(null);
    setJoined(true);
  };

  const handleBack = () => {
    setJoined(false);
    setCode("");
    setError(null);
  };

  if (joined) {
    return <QueueView code={code} onBack={handleBack} />;
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
