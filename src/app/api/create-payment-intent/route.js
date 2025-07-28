// Create new file: src/app/api/create-payment-intent/route.js (for server-side PaymentIntent creation)

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const { amount } = await req.json(); // Expect amount from client (totalPrice)

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // In cents
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    });

    return new Response(JSON.stringify({ clientSecret: paymentIntent.client_secret }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('PaymentIntent creation error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}