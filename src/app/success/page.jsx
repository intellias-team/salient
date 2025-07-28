// Create simple success page: src/app/success/page.jsx

import { Container } from '@/components/Container';
import { Button } from '@/components/Button';

export default function SuccessPage() {
  return (
    <Container className="py-20 text-center">
      <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
      <p>Thank you for your purchase. Your order has been confirmed.</p>
      <Button href="/" className="mt-4">Continue Shopping</Button>
    </Container>
  );
}