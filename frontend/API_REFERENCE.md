## Printify + Stripe Integration - API Reference

### 🔑 Authentication

All Printify requests are authenticated via API key in `Authorization: Bearer` header (handled automatically by `utils/printify.js`).

---

### 🛍️ Shop Endpoints

#### GET `/api/printify/shops`
Get all Printify shops connected to account.

**Response:**
```json
{
  "data": [
    {
      "id": 12345,
      "title": "My Shop",
      "sales_channel": "printify",
      "currency": "USD",
      "timezone": "America/New_York"
    }
  ]
}
```

---

### 📦 Product Endpoints

#### POST `/api/printify/sync-products`
Sync all products from a Printify shop to MongoDB.

**Request:**
```json
{
  "shopId": "12345"
}
```

**Response:**
```json
{
  "message": "✓ Synced 15 products from Printify",
  "count": 15
}
```

**What it does:**
- Fetches all products from Printify shop
- Creates/updates products in MongoDB
- Stores variants and pricing
- Makes products available for sale

---

#### GET `/api/printify/products`
Get all synced physical products.

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Classic T-Shirt",
    "description": "High quality cotton tee",
    "productType": "physical",
    "price": 1999,  // in cents ($19.99)
    "imageUrl": "https://...",
    "printifyProductId": "54321",
    "printifyShopId": "12345",
    "printifyData": {
      "variants": [
        {
          "variantId": "1",
          "title": "Small / White",
          "price": 1999,
          "available": true
        }
      ]
    }
  }
]
```

---

#### GET `/api/printify/products/:productId`
Get single product details.

**Response:** Same as above for single product

---

### 💳 Checkout Endpoints

#### POST `/api/checkout`
**Digital products only** - Uses existing Stripe price ID.

**Request:**
```json
{
  "priceId": "price_1Nzz..."
}
```

**Response:**
```json
{
  "url": "https://checkout.stripe.com/pay/cs_live_xxx"
}
```

---

#### POST `/api/checkout/printify`
**Physical products** - Creates checkout with Printify products.

**Request:**
```json
{
  "items": [
    {
      "productId": "507f1f77bcf86cd799439011",
      "variantId": "1",
      "quantity": 2
    }
  ]
}
```

**Response:**
```json
{
  "url": "https://checkout.stripe.com/pay/cs_live_xxx",
  "orderId": "507f1f77bcf86cd799439012",
  "sessionId": "cs_live_xxx"
}
```

**What happens:**
1. Validates products exist in MongoDB
2. Creates Stripe checkout session with product details
3. Creates Order record in MongoDB (status: "pending")
4. Returns Stripe checkout URL

---

#### GET `/api/checkout/session/:sessionId`
Get Stripe checkout session details.

**Response:**
```json
{
  "id": "cs_live_xxx",
  "status": "complete",
  "payment_status": "paid",
  "customer_details": {
    "email": "customer@example.com",
    "name": "John Doe"
  },
  "shipping_details": {
    "address": {
      "line1": "123 Main St",
      "city": "New York",
      "state": "NY",
      "postal_code": "10001",
      "country": "US"
    }
  }
}
```

---

### 📊 Order Schema

**MongoDB Order Model:**

```javascript
{
  _id: ObjectId,
  
  // Stripe info
  stripeSessionId: "cs_live_xxx",
  stripePaymentIntentId: "pi_xxx",
  
  // Printify info (auto-created after payment)
  printifyOrderId: "12345678",
  printifyShopId: "12345",
  
  // Items ordered
  items: [
    {
      productId: ObjectId,
      printifyProductId: "54321",
      variantId: "1",
      title: "Classic T-Shirt",
      quantity: 2,
      price: 1999  // cents
    }
  ],
  
  // Shipping
  shippingAddress: {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "+1234567890",
    address1: "123 Main St",
    address2: "",
    city: "New York",
    province: "NY",
    country: "US",
    zip: "10001"
  },
  
  // Status tracking
  status: "confirmed",  // pending, confirmed, processing, shipped, delivered, cancelled
  paidAt: Date,
  fulfilledAt: null,
  shippedAt: null,
  
  createdAt: Date,
  updatedAt: Date
}
```

---

### 🔄 Fulfillment Flow

```
1. Customer clicks "Buy Now"
   └─ Frontend detects productType
   
2. Frontend sends to /api/checkout/printify
   └─ Backend creates Order (status: pending)
   └─ Stripe session created
   
3. Customer completes payment
   └─ Stripe calls webhook /webhook/stripe
   
4. Webhook triggers fulfillOrder()
   ├─ Gets shipping info from Stripe session
   ├─ Creates order in Printify
   ├─ Updates Order status to "confirmed"
   └─ Sends confirmation email
   
5. Printify processes physical order
   ├─ Prints product
   ├─ Packs and ships
   └─ Sends tracking number
```

---

### 🚨 Error Handling

**No Printify API Key:**
```json
{
  "error": "Failed to fetch shops"
}
```
Solution: Set `PRINTIFY_API_KEY` in `.env`

**Invalid Shop ID:**
```json
{
  "error": "Failed to sync products"
}
```
Solution: Use correct shop ID from `https://dashboard.printify.com/shops`

**Product Not Found:**
```json
{
  "error": "Product 507f1f77bcf86cd799439011 not found"
}
```
Solution: Make sure product is synced before purchasing

---

### 📱 Frontend Implementation

#### Shop Component with Filter:
```javascript
// src/pages/Shop.jsx - Already updated ✓
// - Fetches all products
// - Filters by productType
// - Handles checkout based on type
```

#### Printify Sync Admin Panel:
```javascript
// src/components/PrintifySync.jsx - For admins
// - Lists available shops
// - Syncs products to DB
// - Shows sync status
```

---

### 💻 Quick Test

**1. Start backend:**
```bash
cd backend
npm install  # if needed
npm run dev
```

**2. Add Printify API key to `.env`:**
```
PRINTIFY_API_KEY=your_key_from_dashboard.printify.com
```

**3. Sync products:**
```bash
curl -X POST http://localhost:5000/api/printify/sync-products \
  -H "Content-Type: application/json" \
  -d '{"shopId":"YOUR_SHOP_ID"}'
```

**4. Verify products synced:**
```bash
curl http://localhost:5000/api/printify/products
```

**5. View in shop:**
- Start frontend: `npm run dev` in `/frontend`
- Go to `/shop`
- See physical products with "🛍️ Physical" badge
- Click "Buy Now" to test checkout

---

### 📚 Resources

- [Printify API Docs](https://help.printify.com/en/articles/5537717-printify-api-reference)
- [Printify Dashboard](https://dashboard.printify.com)
- [Stripe Checkout](https://stripe.com/docs/checkout)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
