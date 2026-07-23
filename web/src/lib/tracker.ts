"use client";

const SESSION_KEY = "_rezzobot_session_id";

function getSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  let sid = localStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = "s_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8);
    localStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

export interface TrackEvent {
  event: string;
  session_id: string;
  url: string;
  referrer: string;
  ts: string;
  data?: Record<string, string | number | boolean>;
}

export function trackEvent(
  event: string,
  data?: Record<string, string | number | boolean>,
) {
  const apiBase =
    (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_BASE_URL) ||
    "https://mk5188.duckdns.org/rezzobot-api";

  const payload: TrackEvent = {
    event,
    session_id: getSessionId(),
    url: window.location.pathname,
    referrer: document.referrer || "",
    ts: new Date().toISOString(),
    data,
  };

  fetch(`${apiBase}/api/track`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {});
}
