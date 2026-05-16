// middleware/brandMiddleware.js
const brandCache = new Map(); // key: hostname, value: {brand, cachedAt}
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const resolveBrand = async (req, res, next) => {
  try {
    const host = req.hostname;
    const hnaDomains = ['localhost', 'hnavault.com', 'www.hnavault.com', process.env.HNA_DOMAIN].filter(Boolean);
    if (hnaDomains.includes(host)) { req.brand = null; return next(); }

    // Check cache first
    const cached = brandCache.get(host);
    if (cached && (Date.now() - cached.cachedAt) < CACHE_TTL) {
      req.brand = cached.brand;
      return next();
    }

    const brand = await Brand.findOne({ domain: host, status: 'active' }).lean();
    brandCache.set(host, { brand: brand || null, cachedAt: Date.now() });
    req.brand = brand || null;
    next();
  } catch (err) {
    console.error('Brand middleware error:', err.message);
    req.brand = null;
    next();
  }
};
