## Printify + Stripe Integration Setup Guide

### 📋 Prerequisites

1. **Stripe Account**
   - Already set up ✓
   - Publishable Key: `pk_test_51NbTcoDNpXFeOTHlCgOLSV9K3wZfsXRkvETNJH5ycny6NiDasA0Z1tmMmGJBBcd3VWhZG8EVMMgXL1ytM00Z39Yn006etKOmLp`
   - Secret Key: Already configured in `.env`

2. **Printify Account**
   - Sign up at https://www.printify.com
   - Get your API Key: https://dashboard.printify.com/settings/api
   - Add to `.env` as `PRINTIFY_API_KEY=your_key_here`

---

### 🚀 Setup Steps

#### Step 1: Get Your Printify API Key

1. Go to https://dashboard.printify.com/settings/api
2. Copy your API token
3. Add to `backend/.env`:
   ```
   PRINTIFY_API_KEY=your_api_token_here
   ```

#### Step 2: Connect Printify Shop

```bash
# Restart the backend after updating .env
npm run dev  # in /backend
```

#### Step 3: Sync Products from Printify

Make an API call to sync your Printify products:

```bash
curl -X POST http://localhost:5000/api/printify/sync-products \
  -H "Content-Type: application/json" \
  -d '{"shopId": "YOUR_PRINTIFY_SHOP_ID"}'
```

Get your Shop ID from: https://dashboard.printify.com/shops

---

### 📡 API Endpoints

#### **Digital Products** (Existing)
- **GET** `/api/products` - Get all visible products
- **POST** `/api/checkout` - Create checkout session (priceId required)

#### **Physical Products** (New - Printify)
- **GET** `/api/printify/shops` - List all Printify shops
- **POST** `/api/printify/sync-products` - Sync Printify products to DB
- **GET** `/api/printify/products` - Get all physical products
- **GET** `/api/printify/products/:productId` - Get product details
- **POST** `/api/checkout/printify` - Create checkout for physical products

---

### 🛒 Checkout Flow

#### Digital Products
```javascript
// Frontend
handleCheckout(product.priceId)
```

#### Physical Products (Printify)
```javascript
// Frontend
const response = await axios.post(`${API}/api/checkout/printify`, {
  items: [{
    productId: product._id,
    variantId: product.printifyData.variants[0].variantId,
    quantity: 1
  }]
});
window.location.href = response.data.url;
```

---

### 💳 Payment Processing

1. **Customer clicks "Buy Now"**
   - Frontend detects product type
   - Sends appropriate checkout request

2. **Stripe Checkout Session Created**
   - Digital: Uses `priceId`
   - Physical: Creates session with line items from Printify data

3. **Customer Pays**
   - Stripe handles payment securely

4. **Order Created**
   - Database saves order with Printify product info
   - Webhook should trigger fulfillment

---

### 🎯 Next Steps

1. ✅ **Backend Setup** - Routes and utilities created
2. ✅ **Frontend Updates** - Shop component updated
3. ⏳ **Stripe Webhooks** - Configure webhook to handle fulfillment
4. ⏳ **Printify Order Creation** - Auto-create orders in Printify after payment
5. ⏳ **Order Tracking** - Add order history page for users

---

### 🔧 Environment Variables Needed

```env
# Backend
PRINTIFY_API_KEY=your_printify_api_key_here
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
MONGODB_URI=your_mongodb_connection

# Frontend (.env.local)
VITE_STRIPE_PUBLIC_KEY=pk_test_xxx
VITE_API_URL=http://localhost:5000
```

---

### ⚠️ Important Notes

- Products have `productType: 'digital'` or `productType: 'physical'`
- Digital products use `priceId` (Stripe price)
- Physical products use `printifyProductId` and variants
- All prices stored in **cents** (1999 = $19.99)
- Physical product orders need Stripe webhook to trigger Printify fulfillment

---

### 📚 Resources

- [Printify API Docs](https://help.printify.com/en/articles/5537717-printify-api-reference)
- [Stripe Checkout Docs](https://stripe.com/docs/checkout)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
