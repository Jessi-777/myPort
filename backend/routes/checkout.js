// backend/routes/checkout.js

const express = require("express");
const Stripe = require("stripe");

const Product = require("../models/Product");
const Order = require("../models/Order");

const router = express.Router();

let stripe;

function getStripe() {
  if (!stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error(
        "STRIPE_SECRET_KEY is not configured"
      );
    }

    stripe = new Stripe(
      process.env.STRIPE_SECRET_KEY
    );
  }

  return stripe;
}

/*
|--------------------------------------------------------------------------
| POST /api/checkout
|
| DIGITAL PRODUCT
|
| Expects:
|
| {
|   productId: "..."
| }
|--------------------------------------------------------------------------
*/

router.post("/", async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        error: "Missing productId",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        error: `Product ${productId} not found`,
      });
    }

    if (product.productType !== "digital") {
      return res.status(400).json({
        error: `${product.title} is not a digital product`,
      });
    }

    if (product.isFree) {
      return res.status(400).json({
        error: `${product.title} is marked as free`,
      });
    }

    if (
      !Number.isFinite(product.price) ||
      product.price <= 0
    ) {
      return res.status(400).json({
        error: `${product.title} does not have a valid price`,
      });
    }

    const stripeClient = getStripe();

    const productData = {
      name: product.title,
      description: product.description || "Digital product",
    };

    if (product.imageUrl) {
      productData.images = [product.imageUrl];
    }

    const session =
      await stripeClient.checkout.sessions.create({
        mode: "payment",

        payment_method_types: ["card"],

        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: productData,

              /*
               * Product.price is already cents.
               */
              unit_amount: Math.round(product.price),
            },

            quantity: 1,
          },
        ],

        success_url:
          `${process.env.CLIENT_URL}/success` +
          `?session_id={CHECKOUT_SESSION_ID}`,

        cancel_url:
          `${process.env.CLIENT_URL}/cancel`,

        billing_address_collection: "auto",

        metadata: {
          productId: product._id.toString(),
        },
      });

    console.log(
      "✅ Digital Stripe session created:",
      session.id
    );

    return res.json({
      success: true,
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error(
      "❌ Digital Stripe checkout error:"
    );

    console.error(error);

    return res.status(500).json({
      error:
        error?.raw?.message ||
        error?.message ||
        "Failed to create Stripe checkout session",
    });
  }
});

/*
|--------------------------------------------------------------------------
| POST /api/checkout/printify
|
| PHYSICAL PRODUCTS
|
| Expects:
|
| {
|   items: [
|     {
|       productId: "...",
|       variantId: "...",
|       quantity: 1
|     }
|   ]
| }
|--------------------------------------------------------------------------
*/

router.post(
  "/printify",
  async (req, res) => {
    try {
      const { items } = req.body;

      if (
        !Array.isArray(items) ||
        items.length === 0
      ) {
        return res.status(400).json({
          error: "No items in cart",
        });
      }

      const lineItems = [];
      const normalizedItems = [];

      for (const item of items) {
        if (!item.productId) {
          return res.status(400).json({
            error: "Missing productId",
          });
        }

        const product =
          await Product.findById(
            item.productId
          );

        if (!product) {
          return res.status(404).json({
            error:
              `Product ${item.productId} not found`,
          });
        }

        /*
         * Physical checkout only.
         */
        if (
          product.productType !==
          "physical"
        ) {
          return res.status(400).json({
            error:
              `${product.title} is not a physical product`,
          });
        }

        if (product.isFree) {
          return res.status(400).json({
            error:
              `${product.title} is marked as free`,
          });
        }

        if (
          !Number.isFinite(product.price) ||
          product.price <= 0
        ) {
          return res.status(400).json({
            error:
              `${product.title} does not have a valid price`,
          });
        }

        const quantity = Math.max(
          1,
          Number.parseInt(
            item.quantity,
            10
          ) || 1
        );

        const productImage =
          product.imageUrl ||
          product.printifyData?.images?.[0]
            ?.src ||
          undefined;

        const productData = {
          name: product.title,
          description:
            product.description ||
            "Physical product",
        };

        if (productImage) {
          productData.images = [
            productImage,
          ];
        }

        lineItems.push({
          price_data: {
            currency: "usd",

            product_data:
              productData,

            /*
             * Product.price is already cents.
             */
            unit_amount:
              Math.round(product.price),
          },

          quantity,
        });

        normalizedItems.push({
          productId:
            product._id.toString(),

          variantId:
            item.variantId || null,

          quantity,
        });
      }

      const stripeClient = getStripe();

      const session =
        await stripeClient.checkout.sessions.create(
          {
            mode: "payment",

            payment_method_types: [
              "card",
            ],

            line_items: lineItems,

            shipping_address_collection: {
              allowed_countries: [
                "US",
                "CA",
                "GB",
                "AU",
              ],
            },

            success_url:
              `${process.env.CLIENT_URL}/success` +
              `?session_id={CHECKOUT_SESSION_ID}`,

            cancel_url:
              `${process.env.CLIENT_URL}/cancel`,

            metadata: {
              cartItems:
                JSON.stringify(
                  normalizedItems
                ),
            },
          }
        );

      /*
       * Only create the order after Stripe
       * successfully creates the session.
       */
      const order =
        await Order.create({
          stripeSessionId:
            session.id,

          items:
            normalizedItems,

          status: "pending",
        });

      console.log(
        "✅ Physical Stripe session created:",
        session.id
      );

      return res.json({
        success: true,
        url: session.url,
        orderId: order._id,
        sessionId: session.id,
      });
    } catch (error) {
      console.error(
        "❌ Physical Stripe checkout error:"
      );

      console.error(error);

      return res.status(500).json({
        error:
          error?.raw?.message ||
          error?.message ||
          "Failed to create physical checkout session",
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| GET /api/checkout/session/:sessionId
|--------------------------------------------------------------------------
*/

router.get(
  "/session/:sessionId",
  async (req, res) => {
    try {
      const { sessionId } =
        req.params;

      if (!sessionId) {
        return res.status(400).json({
          error: "Missing session ID",
        });
      }

      const session =
        await getStripe().checkout.sessions.retrieve(
          sessionId
        );

      return res.json(session);
    } catch (error) {
      console.error(
        "❌ Session retrieval error:",
        error
      );

      return res.status(500).json({
        error:
          error?.raw?.message ||
          error?.message ||
          "Failed to retrieve Stripe session",
      });
    }
  }
);

module.exports = router;