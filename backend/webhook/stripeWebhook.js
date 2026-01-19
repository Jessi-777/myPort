const express = require("express");
const Stripe = require("stripe");
const sendEmail = require("../utils/sendEmail");
const generateSignedUrl = require("../utils/s3");
const { fulfillOrder } = require("./printifyFulfillment");

const router = express.Router(); 

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// RAW BODY REQUIRED
router.post(
  "/",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const signature = req.headers["stripe-signature"];

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("❌ Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook error: ${err.message}`);
    }

    // HANDLE CHECKOUT COMPLETED EVENT
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const sessionId = session.id;
      const email = session.customer_details.email;

      // Optional: Log the event
      console.log("💰 Checkout completed:", sessionId);

      // PROCESS FULFILLMENT (Digital & Physical)
      await fulfillOrder(session);

      // GET LINE ITEMS (files purchased)
      const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);

      const priceToFile = {
        "price_fullmoon": "fullmoon.zip",
        "price_uiuxpack": "uiux_pack.zip",
        "price_peacemixtape": "peace_mixtape.zip",
      };

      const items = [];
      for (const item of lineItems.data) {
        const fileKey = priceToFile[item.price.id];
        if (fileKey) {
          const signedUrl = await generateSignedUrl(fileKey);
          items.push({
            name: item.description,
            url: signedUrl,
          });
        }
      }

      // SEND DOWNLOAD PORTAL EMAIL (for digital products)
      if (items.length > 0) {
        await sendEmail({
          to: email,
          subject: "Your Downloads Are Ready 🎵✨",
          html: `
            <h2>Thank you for your purchase!</h2>
            <p>Your download portal link:</p>
            <a href="${process.env.CLIENT_URL}/downloads?session_id=${sessionId}">
              Access Your Downloads
            </a>
            <p>The portal will generate fresh secure links each visit.</p>
          `,
        });

        console.log("📨 Delivery email sent to:", email);
      } else {
        // For physical products, send fulfillment notification
        await sendEmail({
          to: email,
          subject: "Order Confirmed - Physical Product 📦",
          html: `
            <h2>Thank you for your order!</h2>
            <p>Your Printify order has been confirmed and is being prepared for shipment.</p>
            <p>Order ID: ${sessionId}</p>
            <p>You will receive a tracking number via email when your order ships.</p>
          `,
        });

        console.log("📨 Order confirmation email sent to:", email);
      }
    }

    res.json({ received: true });
  }
);

module.exports = router;



















// const express = require("express");
// const Stripe = require("stripe");
// const sendEmail = require("../utils/sendEmail");

// const router = express.Router();

// // Stripe instance with your secret key
// const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// // To process RAW body (Stripe requirement)
// router.post(
//   "/",
//   express.raw({ type: "application/json" }),
//   async (req, res) => {
//     const signature = req.headers["stripe-signature"];

//     let event;

//     try {
//       event = stripe.webhooks.constructEvent(
//         req.body,
//         signature,
//         process.env.STRIPE_WEBHOOK_SECRET
//       );
//     } catch (err) {
//       console.error("❌ Webhook signature verification failed:", err.message);
//       return res.status(400).send(`Webhook error: ${err.message}`);
//     }

//     // ---- EVENTS ----
//     if (event.type === "checkout.session.completed") {
//       const session = event.data.object;
//       const customerEmail = session.customer_details.email;

//       console.log("💸 Payment completed for:", customerEmail);

//       // ✨ SEND THE EMAIL WITH DOWNLOAD LINKS ✨
//       await sendEmail({
//         to: customerEmail,
//         subject: "Your Tica Order is Ready 🎵✨",
//         html: `
//           <h2>Thank you for your purchase!</h2>
//           <p>Your items are ready to download:</p>

//           <ul>
//             <li><a href="https://yourcdn.com/fullmoon.zip">Full Moon Album</a></li>
//             <li><a href="https://yourcdn.com/peace_mixtape.zip">Peace Mixtape</a></li>
//             <li><a href="https://yourcdn.com/uiux_pack.zip">UI/UX Pack</a></li>
//           </ul>

//           <p>If you have any issues, reply to this email.</p>
//           <p>❤️ - Tica</p>
//         `,
//       });
//     }

//     res.json({ received: true });
//   }
// );

// module.exports = router;
