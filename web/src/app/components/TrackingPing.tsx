"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/tracker";

export default function TrackingPing() {
  useEffect(() => {
    trackEvent("page_view");
  }, []);

  return null;
}
