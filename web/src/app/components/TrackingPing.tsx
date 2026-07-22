"use client";

import { useEffect } from "react";

export default function TrackingPing() {
  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const sendPing = async () => {
      try {
        await fetch(`${apiBase}/api/track`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: window.location.pathname,
            referrer: document.referrer || "",
            ts: new Date().toISOString(),
          }),
          keepalive: true,
        });
      } catch {
        // silent fail
      }
    };
    sendPing();
  }, []);

  return null;
}
