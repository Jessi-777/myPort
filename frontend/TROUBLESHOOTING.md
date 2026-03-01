## Troubleshooting Guide - Printify + Stripe Integration

### ❌ Common Issues & Solutions

---

## Issue 1: "⚠️ PRINTIFY_API_KEY not set in .env"

**Problem:** Backend warns about missing API key

**Solution:**
1. Go to https://dashboard.printify.com/settings/api
2. Copy your API token
3. Add to `backend/.env`:
   ```
   PRINTIFY_API_KEY=your_token_here
   ```
4. Restart backend: `npm run dev`

---

## Issue 2: Products don't appear in shop

**Problem:** Physical products missing from `/shop`

**Solution:**
1. Make sure you've synced products:
   ```bash
   curl -X POST http://localhost:5000/api/printify/sync-products \
     -H "Content-Type: application/json" \
     -d '{"shopId":"YOUR_SHOP_ID"}'
   ```

2. Verify products synced to DB:
   ```bash
   curl http://localhost:5000/api/printify/products
   ```

3. Check MongoDB connection:
   - Verify `MONGODB_URI` in `.env`
   - Make sure cluster allows localhost (MongoDB Atlas)

---

## Issue 3: Checkout fails with "Failed to start checkout"

**Problem:** Click "Buy Now" → nothing happens

**Solution:**

**For Digital Products:**
- Make sure product has `priceId` field
- Verify Stripe test key is valid
- Check browser console for errors

**For Physical Products:**
- Verify product was synced from Printify
- Check that product has `printifyProductId`
- Ensure variants exist in product data
- Try manual sync again

---

## Issue 4: "Product not found" error during checkout

**Problem:** Clicking buy gives 404 error

**Solution:**
1. Verify product ID exists in MongoDB:
   ```bash
   curl http://localhost:5000/api/printify/products
   ```
2. Sync products again from Printify
3. Check product is marked `visible: true`

---

## Issue 5: Webhook doesn't trigger order creation

**Problem:** Payment succeeds but Printify order never created

**Solution:**

**Check webhook is configured:**
1. Go to https://dashboard.stripe.com/webhooks
2. Add webhook endpoint: `https://your-domain/webhook/stripe`
3. Select events: `checkout.session.completed`
4. Copy signing secret → add to `.env`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_xxx
   ```

**Test webhook locally:**
```bash
# Use Stripe CLI to forward webhooks
stripe listen --forward-to localhost:5000/webhook/stripe

# Then checkout on localhost:5173
# You should see webhook events in terminal
```

**Check server logs:**
```bash
# In backend terminal, watch for:
# "💰 Checkout completed:"
# "✓ Printify order created:"
# or error messages
```

---

## Issue 6: "No Printify shops configured"

**Problem:** Webhook says "No Printify shops configured"

**Solution:**
1. Make sure `PRINTIFY_API_KEY` is set correctly
2. Verify you have at least one shop in Printify:
   - https://dashboard.printify.com/shops
3. Test API connection:
   ```bash
   curl https://api.printify.com/v1/shops \
     -H "Authorization: Bearer YOUR_API_KEY"
   ```

---

## Issue 7: Order created but shipping info missing

**Problem:** Order in MongoDB but `shippingAddress` is empty

**Solution:**
1. Make sure `shipping_address_collection` is enabled on checkout:
   - Already configured in code ✓
   
2. Customer must fill shipping address in Stripe checkout
   - Cannot skip shipping address
   - Browser shows address form automatically

3. Verify Stripe session has shipping:
   ```bash
   curl https://api.stripe.com/v1/checkout/sessions/SESSION_ID \
     -u sk_test_xxx:
   ```

---

## Issue 8: "Invalid product type" error

**Problem:** Checkout fails with type validation error

**Solution:**
1. Check product `productType` is set correctly:
   ```bash
   curl http://localhost:5000/api/printify/products
   # Should show: "productType": "physical"
   ```

2. Don't mix digital + physical in one cart
   - Each checkout should be one type
   - Frontend automatically routes based on type

3. Verify product came from Printify sync
   - Products created manually need `productType` set

---

## Issue 9: Stripe checkout button does nothing

**Problem:** Click "Buy Now" → nothing happens (silent failure)

**Solution:**
1. Open browser dev console: `Cmd+Option+J` (Mac) or `F12` (Windows)
2. Check for errors (red text)
3. Common issues:
   - **"Cannot read property 'url' of undefined"** → Checkout failed
   - Check `console.error` for actual error
   - Make sure API call completed

4. Test with test Stripe key:
   - Card: `4242 4242 4242 4242`
   - Any future expiry
   - Any CVC

---

## Issue 10: Order created but never sent to Printify

**Problem:** Order in MongoDB but no Printify order created

**Solution:**

**Enable production orders:**
- In `webhook/printifyFulfillment.js`, ensure:
  ```javascript
  send_to_production: true
  ```
  (Already set ✓)

**Check Printify API limits:**
- Free tier: 1 shop, up to 1000 orders/month
- Check dashboard for usage

**Verify variant IDs:**
- Variant IDs must be numbers
- Code already converts: `parseInt(item.variantId)` ✓

**Test Printify API directly:**
```bash
curl https://api.printify.com/v1/shops/YOUR_SHOP_ID/orders \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "line_items": [{
      "product_id": 123456,
      "variant_id": 1,
      "quantity": 1
    }],
    "shipping_address": {...}
  }'
```

---

## Issue 11: "Sync products" button doesn't work in admin panel

**Problem:** Click "Get Shops" → nothing happens

**Solution:**
1. Make sure you're logged in as admin (if auth required)
2. Check browser console for errors
3. Verify Printify API key is correct
4. Try direct API call:
   ```bash
   curl http://localhost:5000/api/printify/shops
   ```

---

## Issue 12: CORS errors during checkout

**Problem:** Checkout POST fails with CORS error

**Solution:**
1. Verify `CLIENT_URL` in `backend/.env`:
   ```
   CLIENT_URL=http://localhost:5173
   ```

2. Verify `CORS` is configured in `backend/index.js`:
   ```javascript
   cors({
     origin: process.env.CLIENT_URL || "http://localhost:5173",
     credentials: true,
   })
   ```
   (Already configured ✓)

3. Make sure webhook route is BEFORE cors middleware
   - It is in `index.js` ✓

---

## Quick Debug Checklist

Before reporting issues, verify:

- [ ] Backend running: `npm run dev` in `/backend`
- [ ] Frontend running: `npm run dev` in `/frontend`
- [ ] `PRINTIFY_API_KEY` in `backend/.env`
- [ ] `STRIPE_SECRET_KEY` in `backend/.env`
- [ ] `STRIPE_WEBHOOK_SECRET` in `backend/.env`
- [ ] MongoDB connection working
- [ ] Products synced to DB
- [ ] Browser console has no errors
- [ ] Backend terminal shows no errors
- [ ] Using correct Stripe test keys (starts with `pk_test_` or `sk_test_`)

---

## Still Having Issues?

1. **Check logs:**
   - Backend terminal for server errors
   - Browser console (Cmd+Option+J) for client errors
   - MongoDB logs for database errors

2. **Test isolated:**
   - Test Stripe checkout alone (without Printify)
   - Test Printify API directly (with curl)
   - Test products synced to DB

3. **Verify credentials:**
   ```bash
   # Backend
   echo $PRINTIFY_API_KEY
   echo $STRIPE_SECRET_KEY
   
   # Frontend
   echo $VITE_STRIPE_PUBLIC_KEY
   ```

4. **Restart everything:**
   ```bash
   # Kill all terminals
   # Restart backend: npm run dev
   # Restart frontend: npm run dev
   ```

---

## Emergency Commands

**Reset all products:**
```bash
# MongoDB - Remove all products
db.products.deleteMany({})

# Then re-sync from Printify
curl -X POST http://localhost:5000/api/printify/sync-products \
  -H "Content-Type: application/json" \
  -d '{"shopId":"YOUR_SHOP_ID"}'
```

**Clear orders (for testing):**
```bash
# MongoDB
db.orders.deleteMany({})
```

**Test Stripe locally:**
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks
stripe listen --forward-to localhost:5000/webhook/stripe

# Trigger test event
stripe trigger checkout.session.completed
```

---

## When to Contact Support

If you still have issues, provide:
1. **Error message** (exact text)
2. **Where it happens** (which button/page)
3. **Environment** (local/deployed)
4. **Backend logs** (last 20 lines)
5. **Browser console errors** (screenshot)
6. **What you've tried** (so far)

Helpful resources:
- [Printify Support](https://help.printify.com)
- [Stripe Support](https://support.stripe.com)
- [MongoDB Atlas Support](https://support.mongodb.com)
