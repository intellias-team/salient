'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Container } from '@/components/Container';
import Image from 'next/image';
import logo from '@/images/logo.png';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// Dynamically import CheckoutForm with SSR disabled
const CheckoutForm = dynamic(() => import('./CheckoutForm'), { ssr: false });

export default function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}