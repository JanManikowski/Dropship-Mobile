import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import bodyParser from 'body-parser';

import { initializeApp, cert } from 'firebase-admin/app';

import serviceAccount from './serviceAccountKey.json' assert { type: "json" };
import { getFirestore } from 'firebase-admin/firestore';

// 🔑 Setup Stripe + Firebase
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' }); // Replace with your real key
const webhookSecret = process.env.WEBHOOK_SECRET; // Replace with your real webhook secret

initializeApp({
  credential: cert(serviceAccount),
});
const db = getFirestore();

const app = express();

// ⚠️ MUST go first: raw body for Stripe Webhook
app.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('❌ Webhook verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log('✅ Stripe Webhook Triggered');
    console.log('🔥 Metadata:', session.metadata);

    const orderData = {
  email: session.metadata.email,
  total: session.metadata.total,
  insurance: session.metadata.insurance === 'true',
  paymentMethod: session.payment_method_types[0],
  createdAt: new Date(),
  stripeSessionId: session.id,
  userData: {
    name: session.metadata.name,
    lastName: session.metadata.lastName,
    address: session.metadata.address,
    city: session.metadata.city,
    postalCode: session.metadata.postalCode,
    country: session.metadata.country,
    phone: session.metadata.phone,
  },
  cart: JSON.parse(session.metadata.cart || '[]'),
};


    try {
      await db.collection('orders').add(orderData);
      console.log('✅ Order saved to Firestore');
    } catch (error) {
      console.error('❌ Firestore save error:', error.message);
    }
  }

  res.json({ received: true });
});

// ✅ THEN use standard middleware
app.use(cors());
app.use(express.json());

// 🎯 Create Stripe Checkout Session
app.post('/create-checkout-session', async (req, res) => {
  const { items, email, userData, insurance, total } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'No items provided' });
  }

  const lineItems = items.map(item => ({
    price_data: {
      currency: 'eur',
      product_data: {
        name: item.name,
        images: item.image ? [item.image] : [],
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity || 1,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'ideal'],
      mode: 'payment',
      line_items: lineItems,
      customer_email: email,
      success_url: 'http://localhost:5173/thankyou',
      cancel_url: 'http://localhost:5173/cart',
      metadata: {
        email,
        total,
        insurance: insurance ? 'true' : 'false',
        name: userData.name,
        lastName: userData.lastName,
        address: userData.address,
        city: userData.city,
        postalCode: userData.postalCode,
        country: userData.country,
        phone: userData.phone,
        cart: JSON.stringify(items.map(({ name, quantity, price }) => ({ name, quantity, price }))), // keep small
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('❌ Stripe session error:', error.message);
    res.status(500).json({ error: 'Failed to create Stripe session' });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
