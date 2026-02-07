## 🎨 Admin Product Manager - Guide
Admin product manager sells **everything**:
- 🎵 Music & Sound Packs
- 🖼️ Original Art & Paintings  
- 🎬 Films & Videos
- 👕 Custom Clothing
- 🛍️ Print-on-Demand (Printify)
- Any digital or physical original piece

---

## 📊 Admin Dashboard

Visit: `http://localhost:5173/admin`

Two tabs:
1. **📦 Products** - Create & manage all products
2. **🖨️ Printify Sync** - Sync Printify inventory

---

## ✨ Creating Products

### Digital Product (Music, Art, Film)

1. Click **"+ Add Product"**
2. Fill in:
   - **Title**: "Full Moon Album" 
   - **Type**: Digital
   - **Price**: $19.99
   - **Image URL**: Link to album art
   - **Description**: "Produced by Tica Rey..."
   - **Category**: Music
   - **Tags**: music, ambient, exclusive
   - **Stripe Price ID**: price_xxx (get from Stripe)
   - **S3 File Key**: path/to/fullmoon.zip

3. Click **"Create Product"**
4. Shows on shop with 📥 badge

### Physical Product (Original Paintings, Handmade Items)

1. Click **"+ Add Product"**
2. Fill in:
   - **Title**: "I AM Original Painting"
   - **Type**: Physical
   - **Price**: $7,777.00
   - **Image URL**: Photo of painting
   - **Description**: "Original exclusive 10x10..."
   - **Category**: Art
   - **Tags**: original, painting, exclusive

3. Click **"Create Product"**
4. Shows on shop with 🛍️ badge

**Note:** Physical originals don't need Stripe Price ID - they use the price you set

---

## 🛒 Shop Display

Products appear on your shop with:
- Product image
- Title & description  
- Price
- 📥 Digital or 🛍️ Physical badge
- "Buy Now" button

---

## 📈 Product Statistics

Dashboard shows:
- **Total Products** - All items
- **📥 Digital** - Count of music, art, files
- **🛍️ Physical** - Count of originals + Printify items
- **Visible** - Products currently for sale

---

## 🎯 Key Features

✅ **Multiple Product Types**
- Digital (music, files, art)
- Physical originals (paintings, unique items)
- Printify products (apparel, mugs, etc.)

✅ **Full Control**
- Edit product details anytime
- Hide/show products without deleting
- Add tags and categories
- Support for custom descriptions

✅ **Flexible Pricing**
- Any price point ($19.99 or $7,777)
- Prices stored in cents

✅ **Rich Metadata**
- Categories (Music, Art, Fashion)
- Tags for filtering
- Images from any URL

---

## 💳 How Customer Purchases Work

### Digital Product
1. Customer clicks "Buy Now"
2. Sent to Stripe checkout
3. Uses your `priceId`
4. After payment → Email with download link

### Physical Original
1. Customer clicks "Buy Now"
2. Sent to Stripe checkout
3. Enters shipping address
4. After payment → Email confirmation + tracking

### Printify Product
1. Customer clicks "Buy Now"
2. Sent to Stripe checkout
3. Enters shipping address
4. After payment → Auto-created in Printify
5. Printify prints & ships
6. Customer gets tracking

---

## 📝 Example: Setting Up Your Shop

**Step 1: Add Digital Products**
```
Title: Full Moon Album
Type: Digital
Price: $9.99
Stripe Price ID: price_1Nzz...
```

**Step 2: Add Original Painting**
```
Title: I AM Original Painting
Type: Physical
Price: $7,777.00
Description: "Original exclusive 10x10 Painting"
```

**Step 3: Sync Printify Apparel**
- Go to "Printify Sync" tab
- Get your Shop ID from printify.com
- Click "Show My Printify Shops"
- Select shop and sync
- All Printify products now available

**Step 4: You're Live!**
- Shop displays all 3 types
- Customers can buy anything
- Fulfillment happens automatically

---

## 🔧 API Endpoints (Behind Admin Auth)

```javascript
// Get all products
GET /api/admin/products
Headers: { Authorization: "Bearer TOKEN" }

// Create product
POST /api/admin/products
Body: { title, price, productType, ... }

// Update product
PUT /api/admin/products/:id
Body: { fields to update }

// Toggle visibility
PATCH /api/admin/products/:id/toggle-visibility

// Delete product
DELETE /api/admin/products/:id

// Get stats
GET /api/admin/products/stats
```

---

## 🎬 What You Can Sell

| Type | Example | Digital/Physical |
|------|---------|------------------|
| Music | Full Moon Album | Digital |
| Sound Packs | Production Samples | Digital |
| Films | Music Video | Digital |
| Digital Art | Design Templates | Digital |
| UI/UX Packs | TailwindCSS Components | Digital |
| Original Paintings | "I AM" Painting | Physical |
| Handmade Items | Custom Jewelry | Physical |
| Apparel (Printify) | Custom T-Shirts | Physical |
| Mugs (Printify) | Brand Mug | Physical |
| Custom Design | Your Logo Printed | Physical |

---

## 💡 Tips

**For Originals:**
- Upload high-quality images
- Write detailed descriptions
- Set appropriate prices (you control entirely)
- Use meaningful tags for discovery

**For Digital:**
- Always set a Stripe `priceId`
- Keep file keys organized (e.g., `music/fullmoon.zip`)
- Test download links before publishing

**For Printify:**
- Sync regularly if you update Printify products
- Hide old products when not selling
- Use consistent pricing strategy

---

## 🚀 Going Live

Before launch:
1. ✅ Add all digital products with Stripe prices
2. ✅ Create original piece listings
3. ✅ Sync Printify products
4. ✅ Test checkout flow
5. ✅ Switch Stripe to live keys
6. ✅ Update webhook URLs
7. 🎉 Launch!

---

## 📞 Support

Having issues? Check:
- Stripe prices created (`price_xxx` format)
- Admin token stored in localStorage
- Product prices in correct format (cents internally)
- Image URLs are publicly accessible
- File keys match S3 paths
