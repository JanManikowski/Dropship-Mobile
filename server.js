import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

app.use(cors());
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'No items provided' });
    }

    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'eur',
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      success_url: `${req.headers.origin}/thankyou`,
      cancel_url: `${req.headers.origin}/cart`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe session error:', err);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
