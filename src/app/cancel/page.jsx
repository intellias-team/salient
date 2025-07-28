// Create simple cancel page if needed: src/app/cancel/page.jsx (optional, for future use)

import { Container } from '@/components/Container';
import { Button } from '@/components/Button';

export default function CancelPage() {
  return (
    <Container className="py-20 text-center">
      <h1 className="text-3xl font-bold mb-4">Payment Cancelled</h1>
      <p>Your payment was cancelled. You can try again from the cart.</p>
      <Button href="/cart" className="mt-4">Back to Cart</Button>
    </Container>
  );
}