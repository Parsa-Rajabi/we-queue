"use client";
import { useState, useEffect } from "react";
import LandingJoin from "./LandingJoin";
import QueueView from "./QueueView";
import { db } from "../firebase";
import { ref, set } from "firebase/database";

function generateUserId() {
  return Math.random().toString(36).substring(2, 10);
}

export default function Home() {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"code" | "name" | "queue">("code");
  const [userId, setUserId] = useState<string | null>(null);

  // Auto-fill code from URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlCode = params.get("code");
      if (urlCode && urlCode.length === 4) {
        setCode(urlCode.toUpperCase());
        setStep("name");
      }
    }
  }, []);

  // Handle code submit
  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 4) {
      setError("Please enter a valid 4-character code.");
      return;
    }
    setError(null);
    setStep("name");
  };

  // Handle name submit (join queue)
  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    setError(null);
    const newUserId = generateUserId();
    setUserId(newUserId);
    if (typeof window !== "undefined") {
      localStorage.setItem("queueUserId", newUserId);
    }
    const entryRef = ref(db, `queues/${code}/entries/${newUserId}`);
    await set(entryRef, { name, joinedAt: Date.now() });
    setStep("queue");
  };

  // Show queue view after joining
  if (step === "queue" && userId) {
    return <QueueView code={code} userId={userId} />;
  }

  // Show name prompt if code is present
  if (step === "name") {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-white text-gray-900">
        <form className="flex flex-col items-center w-full" onSubmit={handleNameSubmit}>
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2 mt-8">Enter your name to join queue <span className="text-red-600 underline">{code}</span></h1>
          <input
            className="border border-gray-300 rounded px-4 py-3 text-lg text-center w-64 mb-4 focus:outline-none focus:ring-2 focus:ring-teal-400"
            type="text"
            placeholder="Your name *"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            autoFocus
          />
          <button
            className="bg-teal-400 hover:bg-teal-500 text-black font-bold py-2 px-8 rounded text-lg transition-colors"
            type="submit"
          >
            Join Queue
          </button>
          {error && <div className="mt-2 text-red-600 text-sm">{error}</div>}
        </form>
      </div>
    );
  }

  // Default: show code entry
  return (
    <LandingJoin
      code={code}
      onCodeChange={v => { setCode(v); setError(null); }}
      onJoin={handleCodeSubmit}
      error={error}
    />
  );
}
