'use client'; // Add this at the very top to make Hero a Client Component

import Image from 'next/image'
import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import heroImage from '@/images/hero.jpg'
import { useShoppingCart } from 'use-shopping-cart';

const product = { id: 'prod_123', name: 'Item', price: 1000, currency: 'USD' };

export function Hero() {
  const { addItem } = useShoppingCart();

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-black py-0"
    >
    <Container className="pt-20 pb-16 text-center lg:pt-32 relative h-[600px] bg-black">
      <Image
        src={heroImage}
        alt="Hero background"
        layout="fill"
        objectFit="cover"
        objectPosition="center"
        className="absolute inset-0 z-0"
      />
      <div className="relative z-20 mt-77">
        <div className="flex justify-center gap-x-6">
          <Button
			variant="solid"
			color="blue"
			onClick={() => addItem(product)}>Add to Cart</Button>
        </div>
      </div>
    </Container>
    </section>
  )
}