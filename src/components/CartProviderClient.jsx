// Update src/components/CartProviderClient.jsx to switch to client-only mode for custom checkout

'use client'; // This makes it a Client Component

import { loadStripe } from '@stripe/stripe-js';
import { CartProvider } from 'use-shopping-cart';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function CartProviderClient({ children }) {
  return (
    <CartProvider
      mode="client-only" // Changed to client-only for custom checkout
      stripe={stripePromise}
      currency="USD"
      allowedCountries={['US', 'CA']}
    >
      {children}
    </CartProvider>
  );
}