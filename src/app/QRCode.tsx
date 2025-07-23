"use client";
import React from "react";
import { QRCodeCanvas } from "qrcode.react";

type QRCodeProps = {
  value: string;
  size?: number;
};

export default function QRCode({ value, size = 180 }: QRCodeProps) {
  return (
    <div className="flex flex-col items-center">
      <QRCodeCanvas value={value} size={size} />
      <div className="mt-2 text-xs text-gray-500">Scan to join queue</div>
    </div>
  );
} 