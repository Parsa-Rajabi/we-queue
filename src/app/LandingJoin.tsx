"use client";
import React from "react";

type LandingJoinProps = {
  code: string;
  onCodeChange: (v: string) => void;
  onJoin: (e: React.FormEvent) => void;
  error?: string | null;
};

export default function LandingJoin({ code, onCodeChange, onJoin, error }: LandingJoinProps) {
  return (
    <div className="flex flex-col min-h-screen items-center justify-between bg-white text-gray-900">
      <div className="flex flex-col items-center mt-16">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2 mt-8">Enter the code to <span className="text-red-600 underline">Line Up</span></h1>
        <p className="text-lg text-center mb-12">No app to download, no login required.</p>
        <form className="flex flex-col items-center w-full" onSubmit={onJoin}>
          <input
            className="border border-gray-300 rounded px-4 py-3 text-lg text-center w-64 mb-4 focus:outline-none focus:ring-2 focus:ring-teal-400"
            type="text"
            placeholder="4-character code *"
            maxLength={4}
            value={code}
            onChange={e => onCodeChange(e.target.value.toUpperCase())}
            required
            autoFocus
          />
          <button
            className="bg-teal-400 hover:bg-teal-500 text-black font-bold py-2 px-8 rounded text-lg transition-colors"
            type="submit"
          >
            Join
          </button>
          {error && <div className="mt-2 text-red-600 text-sm">{error}</div>}
        </form>
      </div>
      <div className="mb-8 flex flex-col items-center">
        <a href="#" className="font-semibold mb-2">Add your business</a>
        <div className="flex gap-4 text-sm text-gray-500">
          <a href="#">About</a>
          <span>•</span>
          <a href="#">Privacy Policy</a>
          <span>•</span>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </div>
  );
} 