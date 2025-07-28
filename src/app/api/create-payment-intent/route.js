import Stripe from 'stripe';

export async function POST(req) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Lazy init here

  const { amount } = await req.json();

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
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