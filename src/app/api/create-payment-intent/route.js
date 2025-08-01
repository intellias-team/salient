import Stripe from 'stripe';

export async function POST(req) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const { amount, items, discount, shipping } = await req.json();

  // Format description for Stripe
  const description = [
    'Order Details:',
    ...items.map(item => `${item.name} x${item.quantity} @ $${item.price.toFixed(2)}`),
    discount.percent > 0 ? `Discount (${discount.code}): -${discount.percent}%` : '',
    `Shipping: ${shipping.method} - $${(shipping.cost / 100).toFixed(2)}`,
  ].filter(line => line).join('\n');

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // In cents
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      description, // Include order details
    });

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        receiptNumber: paymentIntent.id, // Use paymentIntent.id as receiptNumber
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('PaymentIntent creation error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}