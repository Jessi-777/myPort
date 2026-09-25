import axios from "axios";

const API = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

function getOrCreateId(storage, key) {
  let id = storage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    storage.setItem(key, id);
  }
  return id;
}

export function trackPageView(page) {
  try {
    const visitorId = getOrCreateId(localStorage, "analyticsVisitorId");
    const sessionId = getOrCreateId(sessionStorage, "analyticsSessionId");

    axios
      .post(`${API}/api/analytics/track`, {
        visitorId,
        sessionId,
        event: "page_view",
        page,
        title: document.title,
        referrer: document.referrer,
        screenWidth: window.screen?.width,
        screenHeight: window.screen?.height,
        language: navigator.language,
      })
      .catch(() => {});
  } catch {
    // Tracking should never break the site.
  }
}
