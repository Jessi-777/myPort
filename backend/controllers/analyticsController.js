const crypto = require("crypto");
const AnalyticsEvent = require("../models/AnalyticsEvent");

// ============================================================
// HELPERS
// ============================================================

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  return (
    req.headers["x-real-ip"] ||
    req.socket?.remoteAddress ||
    "unknown"
  );
}

function hashIp(ip) {
  const secret =
    process.env.ANALYTICS_HASH_SECRET ||
    process.env.ADMIN_JWT_SECRET ||
    "change-this-secret";

  return crypto
    .createHmac("sha256", secret)
    .update(ip)
    .digest("hex");
}

function parseDevice(userAgent = "") {
  const ua = userAgent.toLowerCase();

  if (/ipad|tablet|playbook|silk/i.test(ua)) {
    return "Tablet";
  }

  if (
    /mobile|iphone|ipod|android.*mobile|windows phone|blackberry/i.test(
      ua
    )
  ) {
    return "Mobile";
  }

  if (/android/i.test(ua)) {
    return "Tablet";
  }

  if (!ua) {
    return "Unknown";
  }

  return "Desktop";
}

function parseBrowser(userAgent = "") {
  if (!userAgent) return "Unknown";

  if (/edg\//i.test(userAgent)) return "Edge";
  if (/opr\//i.test(userAgent)) return "Opera";
  if (/chrome\//i.test(userAgent) && !/edg\//i.test(userAgent)) {
    return "Chrome";
  }
  if (/firefox\//i.test(userAgent)) return "Firefox";
  if (/safari\//i.test(userAgent) && !/chrome\//i.test(userAgent)) {
    return "Safari";
  }
  if (/msie|trident/i.test(userAgent)) return "Internet Explorer";

  return "Other";
}

function parseOS(userAgent = "") {
  if (!userAgent) return "Unknown";

  if (/windows nt/i.test(userAgent)) return "Windows";
  if (/mac os x/i.test(userAgent)) return "macOS";
  if (/iphone|ipad|ipod/i.test(userAgent)) return "iOS";
  if (/android/i.test(userAgent)) return "Android";
  if (/linux/i.test(userAgent)) return "Linux";

  return "Other";
}

function getTrafficSource(referrer = "", utmSource = "") {
  if (utmSource) {
    return utmSource;
  }

  if (!referrer) {
    return "Direct";
  }

  try {
    const url = new URL(referrer);
    const host = url.hostname.toLowerCase();

    if (host.includes("google.")) return "Google";
    if (host.includes("bing.")) return "Bing";
    if (host.includes("yahoo.")) return "Yahoo";
    if (host.includes("duckduckgo.")) return "DuckDuckGo";
    if (host.includes("instagram.")) return "Instagram";
    if (host.includes("facebook.")) return "Facebook";
    if (host.includes("tiktok.")) return "TikTok";
    if (host.includes("youtube.")) return "YouTube";
    if (host.includes("linkedin.")) return "LinkedIn";
    if (host.includes("twitter.") || host.includes("x.com")) {
      return "X";
    }

    return host.replace(/^www\./, "");
  } catch {
    return "Referral";
  }
}

// Simple in-memory location cache.
// This prevents hitting the geolocation provider for every page view.
const geoCache = new Map();

async function lookupLocation(ip) {
  if (!ip || ip === "unknown" || ip === "::1" || ip === "127.0.0.1") {
    return {};
  }

  if (geoCache.has(ip)) {
    return geoCache.get(ip);
  }

  try {
    const response = await fetch(
      `https://ipapi.co/${encodeURIComponent(ip)}/json/`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "WebsiteAnalytics/1.0",
        },
      }
    );

    if (!response.ok) {
      return {};
    }

    const data = await response.json();

    const location = {
      country: data.country_name || "Unknown",
      region: data.region || "Unknown",
      city: data.city || "Unknown",
      timezone: data.timezone || "",
      latitude:
        typeof data.latitude === "number" ? data.latitude : null,
      longitude:
        typeof data.longitude === "number" ? data.longitude : null,
    };

    geoCache.set(ip, location);

    // Prevent unlimited growth on long-running servers.
    if (geoCache.size > 5000) {
      const firstKey = geoCache.keys().next().value;

      if (firstKey) {
        geoCache.delete(firstKey);
      }
    }

    return location;
  } catch (error) {
    console.error("Analytics geolocation lookup failed:", error.message);
    return {};
  }
}

// ============================================================
// TRACK PUBLIC EVENT
// POST /api/analytics/track
// ============================================================

exports.trackEvent = async (req, res) => {
  try {
    const {
      visitorId,
      sessionId,
      event = "page_view",
      page = "/",
      title = "",
      referrer = "",
      utmSource = "",
      utmMedium = "",
      utmCampaign = "",
      screenWidth,
      screenHeight,
      language = "",
      durationSeconds = 0,
    } = req.body || {};

    if (!visitorId || !sessionId) {
      return res.status(400).json({
        error: "visitorId and sessionId are required",
      });
    }

    const allowedEvents = [
      "page_view",
      "heartbeat",
      "page_exit",
      "product_view",
      "add_to_cart",
      "checkout_started",
      "purchase",
      "signup",
      "login",
      "contact",
      "custom",
    ];

    if (!allowedEvents.includes(event)) {
      return res.status(400).json({
        error: "Invalid analytics event",
      });
    }

    const userAgent = req.headers["user-agent"] || "";
    const ip = getClientIp(req);

    // Ignore obvious bots.
    if (
      /bot|crawler|spider|slurp|facebookexternalhit|preview/i.test(
        userAgent
      )
    ) {
      return res.status(204).end();
    }

    const ipHash = hashIp(ip);

    const existingVisitor = await AnalyticsEvent.findOne({
      visitorId,
    }).select("_id");

    // Only perform geolocation when we don't already know this visitor.
    let location = {};

    if (!existingVisitor) {
      location = await lookupLocation(ip);
    }

    const trafficSource = getTrafficSource(
      referrer,
      utmSource
    );

    const analyticsEvent = await AnalyticsEvent.create({
      visitorId,
      sessionId,
      event,
      page: String(page).slice(0, 500),
      title: String(title).slice(0, 300),
      referrer: String(referrer).slice(0, 1000),
      trafficSource,
      utmSource: String(utmSource).slice(0, 200),
      utmMedium: String(utmMedium).slice(0, 200),
      utmCampaign: String(utmCampaign).slice(0, 300),

      country: location.country || "Unknown",
      region: location.region || "Unknown",
      city: location.city || "Unknown",
      timezone: location.timezone || "",
      latitude: location.latitude ?? null,
      longitude: location.longitude ?? null,

      ipHash,

      device: parseDevice(userAgent),
      browser: parseBrowser(userAgent),
      os: parseOS(userAgent),

      screenWidth:
        Number.isFinite(Number(screenWidth))
          ? Number(screenWidth)
          : null,

      screenHeight:
        Number.isFinite(Number(screenHeight))
          ? Number(screenHeight)
          : null,

      language: String(language).slice(0, 100),

      durationSeconds:
        Number.isFinite(Number(durationSeconds))
          ? Math.max(0, Math.min(Number(durationSeconds), 86400))
          : 0,

      userAgent: userAgent.slice(0, 1000),
    });

    return res.status(201).json({
      success: true,
      id: analyticsEvent._id,
    });
  } catch (error) {
    console.error("Analytics tracking error:", error);

    // Analytics should never break the customer's website.
    return res.status(204).end();
  }
};

// ============================================================
// GET ANALYTICS OVERVIEW
// GET /api/admin/analytics/overview
// ============================================================

exports.getOverview = async (req, res) => {
  try {
    const days = Math.min(
      Math.max(parseInt(req.query.days, 10) || 30, 1),
      365
    );

    const since = new Date(
      Date.now() - days * 24 * 60 * 60 * 1000
    );

    const [
      totals,
      daily,
      pages,
      sources,
      locations,
      devices,
      browsers,
      operatingSystems,
      live,
      recent,
    ] = await Promise.all([
      getTotals(since),
      getDailyTraffic(since),
      getTopPages(since),
      getTrafficSources(since),
      getLocations(since),
      getDevices(since),
      getBrowsers(since),
      getOperatingSystems(since),
      getLiveVisitors(),
      getRecentVisitors(),
    ]);

    return res.json({
      range: {
        days,
        since,
        until: new Date(),
      },

      totals,
      daily,
      pages,
      sources,
      locations,
      devices,
      browsers,
      operatingSystems,
      live,
      recent,
    });
  } catch (error) {
    console.error("Analytics overview error:", error);

    return res.status(500).json({
      error: "Failed to load analytics",
    });
  }
};

// ============================================================
// TOTALS
// ============================================================

async function getTotals(since) {
  const [
    pageViews,
    visitors,
    sessions,
    newVisitors,
    returningVisitors,
    totalDuration,
  ] = await Promise.all([
    AnalyticsEvent.countDocuments({
      event: "page_view",
      createdAt: { $gte: since },
    }),

    AnalyticsEvent.distinct("visitorId", {
      createdAt: { $gte: since },
    }),

    AnalyticsEvent.distinct("sessionId", {
      createdAt: { $gte: since },
    }),

    getNewVisitors(since),

    getReturningVisitors(since),

    AnalyticsEvent.aggregate([
      {
        $match: {
          createdAt: { $gte: since },
          event: "page_exit",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$durationSeconds" },
        },
      },
    ]),
  ]);

  const uniqueVisitors = visitors.length;
  const totalSessions = sessions.length;

  const totalSeconds = totalDuration[0]?.total || 0;

  const avgSessionDuration =
    totalSessions > 0
      ? Math.round(totalSeconds / totalSessions)
      : 0;

  const pagesPerSession =
    totalSessions > 0
      ? Number((pageViews / totalSessions).toFixed(2))
      : 0;

  return {
    pageViews,
    uniqueVisitors,
    sessions: totalSessions,
    newVisitors,
    returningVisitors,
    avgSessionDuration,
    pagesPerSession,
  };
}

async function getNewVisitors(since) {
  const result = await AnalyticsEvent.aggregate([
    {
      $group: {
        _id: "$visitorId",
        firstSeen: { $min: "$createdAt" },
      },
    },
    {
      $match: {
        firstSeen: { $gte: since },
      },
    },
    {
      $count: "count",
    },
  ]);

  return result[0]?.count || 0;
}

async function getReturningVisitors(since) {
  const visitors = await AnalyticsEvent.aggregate([
    {
      $group: {
        _id: "$visitorId",
        firstSeen: { $min: "$createdAt" },
        lastSeen: { $max: "$createdAt" },
      },
    },
    {
      $match: {
        lastSeen: { $gte: since },
        firstSeen: { $lt: since },
      },
    },
    {
      $count: "count",
    },
  ]);

  return visitors[0]?.count || 0;
}

// ============================================================
// DAILY TRAFFIC
// ============================================================

async function getDailyTraffic(since) {
  return AnalyticsEvent.aggregate([
    {
      $match: {
        createdAt: { $gte: since },
        event: "page_view",
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt",
          },
        },
        views: { $sum: 1 },
        visitors: { $addToSet: "$visitorId" },
        sessions: { $addToSet: "$sessionId" },
      },
    },
    {
      $project: {
        _id: 0,
        date: "$_id",
        views: 1,
        visitors: { $size: "$visitors" },
        sessions: { $size: "$sessions" },
      },
    },
    {
      $sort: { date: 1 },
    },
  ]);
}

// ============================================================
// TOP PAGES
// ============================================================

async function getTopPages(since) {
  return AnalyticsEvent.aggregate([
    {
      $match: {
        createdAt: { $gte: since },
        event: "page_view",
      },
    },
    {
      $group: {
        _id: "$page",
        views: { $sum: 1 },
        visitors: { $addToSet: "$visitorId" },
      },
    },
    {
      $project: {
        _id: 0,
        page: "$_id",
        views: 1,
        visitors: { $size: "$visitors" },
      },
    },
    {
      $sort: {
        views: -1,
      },
    },
    {
      $limit: 10,
    },
  ]);
}

// ============================================================
// SOURCES
// ============================================================

async function getTrafficSources(since) {
  return AnalyticsEvent.aggregate([
    {
      $match: {
        createdAt: { $gte: since },
        event: "page_view",
      },
    },
    {
      $group: {
        _id: "$trafficSource",
        visits: { $sum: 1 },
        visitors: { $addToSet: "$visitorId" },
      },
    },
    {
      $project: {
        _id: 0,
        source: "$_id",
        visits: 1,
        visitors: { $size: "$visitors" },
      },
    },
    {
      $sort: {
        visits: -1,
      },
    },
    {
      $limit: 10,
    },
  ]);
}

// ============================================================
// LOCATIONS
// ============================================================

async function getLocations(since) {
  return AnalyticsEvent.aggregate([
    {
      $match: {
        createdAt: { $gte: since },
        event: "page_view",
      },
    },
    {
      $group: {
        _id: {
          country: "$country",
          region: "$region",
          city: "$city",
        },
        visits: { $sum: 1 },
        visitors: { $addToSet: "$visitorId" },
      },
    },
    {
      $project: {
        _id: 0,
        country: "$_id.country",
        region: "$_id.region",
        city: "$_id.city",
        visits: 1,
        visitors: { $size: "$visitors" },
      },
    },
    {
      $sort: {
        visits: -1,
      },
    },
    {
      $limit: 15,
    },
  ]);
}

// ============================================================
// DEVICES
// ============================================================

async function getDevices(since) {
  return AnalyticsEvent.aggregate([
    {
      $match: {
        createdAt: { $gte: since },
        event: "page_view",
      },
    },
    {
      $group: {
        _id: "$device",
        visits: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        name: "$_id",
        visits: 1,
      },
    },
    {
      $sort: {
        visits: -1,
      },
    },
  ]);
}

// ============================================================
// BROWSERS
// ============================================================

async function getBrowsers(since) {
  return AnalyticsEvent.aggregate([
    {
      $match: {
        createdAt: { $gte: since },
        event: "page_view",
      },
    },
    {
      $group: {
        _id: "$browser",
        visits: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        name: "$_id",
        visits: 1,
      },
    },
    {
      $sort: {
        visits: -1,
      },
    },
  ]);
}

// ============================================================
// OPERATING SYSTEMS
// ============================================================

async function getOperatingSystems(since) {
  return AnalyticsEvent.aggregate([
    {
      $match: {
        createdAt: { $gte: since },
        event: "page_view",
      },
    },
    {
      $group: {
        _id: "$os",
        visits: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        name: "$_id",
        visits: 1,
      },
    },
    {
      $sort: {
        visits: -1,
      },
    },
  ]);
}

// ============================================================
// LIVE VISITORS
// ============================================================

async function getLiveVisitors() {
  const since = new Date(Date.now() - 5 * 60 * 1000);

  const visitors = await AnalyticsEvent.aggregate([
    {
      $match: {
        createdAt: { $gte: since },
        event: {
          $in: ["page_view", "heartbeat"],
        },
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $group: {
        _id: "$visitorId",
        visitorId: { $first: "$visitorId" },
        sessionId: { $first: "$sessionId" },
        page: { $first: "$page" },
        country: { $first: "$country" },
        region: { $first: "$region" },
        city: { $first: "$city" },
        device: { $first: "$device" },
        browser: { $first: "$browser" },
        lastSeen: { $first: "$createdAt" },
      },
    },
    {
      $sort: {
        lastSeen: -1,
      },
    },
    {
      $limit: 50,
    },
  ]);

  return {
    count: visitors.length,
    visitors,
  };
}

// ============================================================
// RECENT VISITORS
// ============================================================

async function getRecentVisitors() {
  return AnalyticsEvent.aggregate([
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $match: {
        event: "page_view",
      },
    },
    {
      $group: {
        _id: "$visitorId",
        visitorId: { $first: "$visitorId" },
        page: { $first: "$page" },
        country: { $first: "$country" },
        region: { $first: "$region" },
        city: { $first: "$city" },
        device: { $first: "$device" },
        browser: { $first: "$browser" },
        os: { $first: "$os" },
        trafficSource: { $first: "$trafficSource" },
        lastSeen: { $first: "$createdAt" },
      },
    },
    {
      $sort: {
        lastSeen: -1,
      },
    },
    {
      $limit: 25,
    },
  ]);
}