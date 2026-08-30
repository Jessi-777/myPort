// backend/routes/analytics.js

const express = require("express");
const jwt = require("jsonwebtoken");
const AnalyticsEvent = require("../models/AnalyticsEvent");
const Order = require("../models/Order");

const router = express.Router();

/* ============================================================
   ADMIN AUTH
============================================================ */

function protectAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Authorization token required",
      });
    }

    const token = authHeader.split(" ")[1];

    const secret = process.env.ADMIN_JWT_SECRET;

    if (!secret) {
      console.error("❌ ADMIN_JWT_SECRET is not configured");

      return res.status(500).json({
        error: "Admin authentication is not configured",
      });
    }

    const decoded = jwt.verify(token, secret);

    if (decoded?.role !== "admin") {
      return res.status(403).json({
        error: "Admin access required",
      });
    }

    req.admin = decoded;

    next();
  } catch (error) {
    console.error("❌ Analytics auth error:", error.message);

    return res.status(401).json({
      error: "Invalid or expired admin token",
    });
  }
}

/* ============================================================
   OVERVIEW
============================================================ */

router.get("/overview", protectAdmin, async (req, res) => {
  try {
    const days = Math.min(
      Math.max(parseInt(req.query.days, 10) || 30, 1),
      365
    );

    const since = new Date();
    since.setDate(since.getDate() - days);

    const eventRange = {
      createdAt: { $gte: since },
    };

    const validOrderMatch = {
      createdAt: { $gte: since },
      status: {
        $nin: ["cancelled", "failed"],
      },
    };

    const [
      totalEvents,
      uniqueVisitors,
      pageViews,
      productViews,
      addToCart,
      checkoutStarted,
      purchases,
      signups,
      sessions,
      orders,
      revenueResult,
    ] = await Promise.all([
      AnalyticsEvent.countDocuments(eventRange),

      AnalyticsEvent.distinct("visitorId", eventRange),

      AnalyticsEvent.countDocuments({
        event: "page_view",
        ...eventRange,
      }),

      AnalyticsEvent.countDocuments({
        event: "product_view",
        ...eventRange,
      }),

      AnalyticsEvent.countDocuments({
        event: "add_to_cart",
        ...eventRange,
      }),

      AnalyticsEvent.countDocuments({
        event: "checkout_started",
        ...eventRange,
      }),

      AnalyticsEvent.countDocuments({
        event: "purchase",
        ...eventRange,
      }),

      AnalyticsEvent.countDocuments({
        event: "signup",
        ...eventRange,
      }),

      AnalyticsEvent.distinct("sessionId", eventRange),

      Order.countDocuments(validOrderMatch),

      Order.aggregate([
        {
          $match: validOrderMatch,
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: {
                $ifNull: ["$total", 0],
              },
            },
          },
        },
      ]),
    ]);

    const revenueCents = Number(
      revenueResult[0]?.total || 0
    );

    const visitorCount = uniqueVisitors.length;
    const sessionCount = sessions.length;

    const conversionRate =
      visitorCount > 0
        ? (purchases / visitorCount) * 100
        : 0;

    const averageOrderValueCents =
      orders > 0
        ? Math.round(revenueCents / orders)
        : 0;

    res.json({
      range: {
        days,
        since,
      },

      totals: {
        events: totalEvents,

        visitors: visitorCount,

        sessions: sessionCount,

        pageViews,

        productViews,

        addToCart,

        checkoutStarted,

        purchases,

        signups,

        orders,

        revenueCents,

        revenue: revenueCents / 100,

        averageOrderValueCents,

        averageOrderValue:
          averageOrderValueCents / 100,

        conversionRate: Number(
          conversionRate.toFixed(2)
        ),
      },
    });
  } catch (error) {
    console.error(
      "❌ Analytics overview error:",
      error
    );

    res.status(500).json({
      error: "Failed to load analytics overview",
    });
  }
});



/* ============================================================
   DAILY TRAFFIC / SALES
============================================================ */

router.get("/daily", protectAdmin, async (req, res) => {
  try {
    const days = Math.min(
      Math.max(parseInt(req.query.days, 10) || 30, 1),
      365
    );

    const since = new Date();

    since.setDate(since.getDate() - days);

    const data = await AnalyticsEvent.aggregate([
      {
        $match: {
          createdAt: { $gte: since },
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

          visitors: {
            $addToSet: "$visitorId",
          },

          sessions: {
            $addToSet: "$sessionId",
          },

          pageViews: {
            $sum: {
              $cond: [
                { $eq: ["$event", "page_view"] },
                1,
                0,
              ],
            },
          },

          productViews: {
            $sum: {
              $cond: [
                { $eq: ["$event", "product_view"] },
                1,
                0,
              ],
            },
          },

          purchases: {
            $sum: {
              $cond: [
                { $eq: ["$event", "purchase"] },
                1,
                0,
              ],
            },
          },
        },
      },

      {
        $project: {
          _id: 0,
          date: "$_id",
          visitors: { $size: "$visitors" },
          sessions: { $size: "$sessions" },
          pageViews: 1,
          productViews: 1,
          purchases: 1,
        },
      },

      {
        $sort: {
          date: 1,
        },
      },
    ]);

    res.json(data);
  } catch (error) {
    console.error("❌ Analytics daily error:", error);

    res.status(500).json({
      error: "Failed to load daily analytics",
    });
  }
});

/* ============================================================
   TOP PAGES
============================================================ */

router.get("/pages", protectAdmin, async (req, res) => {
  try {
    const days = Math.min(
      Math.max(parseInt(req.query.days, 10) || 30, 1),
      365
    );

    const since = new Date();

    since.setDate(since.getDate() - days);

    const pages = await AnalyticsEvent.aggregate([
      {
        $match: {
          event: "page_view",
          createdAt: { $gte: since },
        },
      },

      {
        $group: {
          _id: "$page",

          views: {
            $sum: 1,
          },

          visitors: {
            $addToSet: "$visitorId",
          },
        },
      },

      {
        $project: {
          _id: 0,
          page: "$_id",
          views: 1,
          visitors: {
            $size: "$visitors",
          },
        },
      },

      {
        $sort: {
          views: -1,
        },
      },

      {
        $limit: 20,
      },
    ]);

    res.json(pages);
  } catch (error) {
    console.error("❌ Analytics pages error:", error);

    res.status(500).json({
      error: "Failed to load page analytics",
    });
  }
});

/* ============================================================
   DEVICES
============================================================ */

router.get("/devices", protectAdmin, async (req, res) => {
  try {
    const days = Math.min(
      Math.max(parseInt(req.query.days, 10) || 30, 1),
      365
    );

    const since = new Date();

    since.setDate(since.getDate() - days);

    const devices = await AnalyticsEvent.aggregate([
      {
        $match: {
          event: "page_view",
          createdAt: { $gte: since },
        },
      },

      {
        $group: {
          _id: "$device",
          views: {
            $sum: 1,
          },
          visitors: {
            $addToSet: "$visitorId",
          },
        },
      },

      {
        $project: {
          _id: 0,
          device: "$_id",
          views: 1,
          visitors: {
            $size: "$visitors",
          },
        },
      },

      {
        $sort: {
          views: -1,
        },
      },
    ]);

    res.json(devices);
  } catch (error) {
    console.error("❌ Analytics devices error:", error);

    res.status(500).json({
      error: "Failed to load device analytics",
    });
  }
});

/* ============================================================
   TRAFFIC SOURCES
============================================================ */

router.get("/traffic", protectAdmin, async (req, res) => {
  try {
    const days = Math.min(
      Math.max(parseInt(req.query.days, 10) || 30, 1),
      365
    );

    const since = new Date();

    since.setDate(since.getDate() - days);

    const traffic = await AnalyticsEvent.aggregate([
      {
        $match: {
          event: "page_view",
          createdAt: { $gte: since },
        },
      },

      {
        $group: {
          _id: {
            $ifNull: ["$trafficSource", "Direct"],
          },

          views: {
            $sum: 1,
          },

          visitors: {
            $addToSet: "$visitorId",
          },
        },
      },

      {
        $project: {
          _id: 0,
          source: "$_id",
          views: 1,
          visitors: {
            $size: "$visitors",
          },
        },
      },

      {
        $sort: {
          views: -1,
        },
      },
    ]);

    res.json(traffic);
  } catch (error) {
    console.error("❌ Analytics traffic error:", error);

    res.status(500).json({
      error: "Failed to load traffic analytics",
    });
  }
});

module.exports = router;

