'use client';

import { useState, useEffect, useRef } from 'react';
import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements, PaymentRequestButtonElement } from '@stripe/react-stripe-js';
import { useShoppingCart } from 'use-shopping-cart';
import { Button } from '@/components/Button';
import { Container } from '@/components/Container';
import Image from 'next/image';
import logo from '@/images/logo.png';

// Common style options for each element (customize as needed)
const elementStyles = {
  base: {
    fontSize: '16px',
    color: '#32325d',
    '::placeholder': {
      color: '#aab7c4',
    },
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a',
  },
};

// Shipping options (adjust rates as needed)
const shippingOptions = [
  { label: 'Flat USPS', value: 'flat_usps', cost: 500 }, // $5.00 in cents
  { label: 'FedEx Ground', value: 'fedex_ground', cost: 1000 }, // $10.00
  { label: 'FedEx Overnight', value: 'fedex_overnight', cost: 2500 }, // $25.00
];

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { totalPrice, cartDetails, clearCart } = useShoppingCart();
  const [clientSecret, setClientSecret] = useState('');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [cartReady, setCartReady] = useState(false);
  const isCreatingPaymentIntent = useRef(false);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [billingAddress, setBillingAddress] = useState({
    line1: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'US',
  });
  const [shippingAddress, setShippingAddress] = useState({
    line1: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'US',
  });
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [selectedShipping, setSelectedShipping] = useState(shippingOptions[0].value);
  const shippingCost = shippingOptions.find(opt => opt.value === selectedShipping)?.cost || 0;

  // Load discount from localStorage
  const [appliedDiscount, setAppliedDiscount] = useState({ code: '', percent: 0 });
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedDiscount = localStorage.getItem('appliedDiscount');
      if (storedDiscount) {
        setAppliedDiscount(JSON.parse(storedDiscount));
      }
    }
  }, []);

  // Wait for cartDetails to be ready
  useEffect(() => {
    if (cartDetails && Object.keys(cartDetails).length > 0 && totalPrice > 0) {
      setCartReady(true);
      console.log('Cart is ready:', { cartDetailsKeys: Object.keys(cartDetails), totalPrice });
    } else {
      console.log('Cart not ready:', { cartDetailsKeys: Object.keys(cartDetails || {}), totalPrice });
    }
  }, [cartDetails, totalPrice]);

  // Calculate totals with discount and shipping
  const subtotal = totalPrice || 0;
  const discountAmount = (subtotal * appliedDiscount.percent) / 100;
  const discountedSubtotal = subtotal - discountAmount;
  const grandTotal = discountedSubtotal + shippingCost;

  // Fetch client secret and paymentIntent.id for PaymentIntent
  useEffect(() => {
    let isMounted = true;

    async function createPaymentIntent() {
      if (isCreatingPaymentIntent.current) {
        console.log('Skipping PaymentIntent creation: already in progress');
        return;
      }
      isCreatingPaymentIntent.current = true;
      console.log('Creating PaymentIntent with:', { grandTotal, subtotal, shippingCost, discountAmount, cartDetailsKeys: Object.keys(cartDetails || {}) });

      const cartItems = Object.entries(cartDetails || {}).map(([id, item]) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price / 100,
      }));
      const shippingLabel = shippingOptions.find(opt => opt.value === selectedShipping)?.label || 'None';
      try {
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: grandTotal,
            items: cartItems,
            discount: appliedDiscount,
            shipping: { method: selectedShipping, cost: shippingCost },
          }),
        });
        const data = await response.json();
        if (isMounted && data.clientSecret) {
          setClientSecret(data.clientSecret);
          setReceiptNumber(data.receiptNumber);
          console.log('PaymentIntent created:', { clientSecret: data.clientSecret, receiptNumber: data.receiptNumber, amount: grandTotal });
        } else if (isMounted) {
          setError(data.error || 'Failed to create payment intent');
          console.error('PaymentIntent creation failed:', data.error);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to create payment intent: ' + err.message);
          console.error('PaymentIntent creation error:', err);
        }
      } finally {
        isCreatingPaymentIntent.current = false;
      }
    }

    if (cartReady && grandTotal > 0 && subtotal > 0 && Object.keys(cartDetails || {}).length > 0) {
      createPaymentIntent();
    } else {
      console.log('Skipping PaymentIntent creation: invalid conditions', { cartReady, grandTotal, subtotal, cartDetailsKeys: Object.keys(cartDetails || {}) });
    }

    return () => {
      isMounted = false;
    };
  }, [cartReady, grandTotal, cartDetails, appliedDiscount, selectedShipping]);

  // Setup Payment Request for Apple Pay / Google Pay
  useEffect(() => {
    if (stripe && grandTotal > 0 && subtotal > 0 && clientSecret && cartReady) {
      console.log('Setting up Payment Request with:', { grandTotal, clientSecret });
      const pr = stripe.paymentRequest({
        country: 'US',
        currency: 'usd',
        total: {
          label: 'Total',
          amount: grandTotal,
        },
        requestPayerName: true,
        requestPayerEmail: true,
        requestPayerPhone: true,
        requestShipping: true,
      });

      pr.canMakePayment().then((result) => {
        if (result) {
          setPaymentRequest(pr);
          console.log('Payment Request available:', result);
        }
      });

      pr.on('paymentmethod', async (ev) => {
        console.log('Apple Pay/Google Pay payment initiated');
        const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
          clientSecret,
          { payment_method: ev.paymentMethod.id },
          { handleActions: false }
        );

        if (confirmError) {
          ev.complete('fail');
          setError(confirmError.message);
          console.error('Apple Pay/Google Pay confirmation error:', confirmError);
        } else {
          ev.complete('success');
          clearCart();
          if (typeof window !== 'undefined') {
            localStorage.removeItem('appliedDiscount');
          }
          await sendOrderEmail(ev.payerEmail || email, paymentIntent.id);
          console.log('Apple Pay/Google Pay payment confirmed:', { paymentIntentId: paymentIntent.id });
          window.location.href = '/success';
        }
      });
    }
  }, [stripe, grandTotal, clientSecret, email, subtotal, cartReady]);

  // Copy billing to shipping if checkbox is checked
  useEffect(() => {
    if (sameAsBilling) {
      setShippingAddress(billingAddress);
    }
  }, [sameAsBilling, billingAddress]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      setError('Stripe has not loaded yet.');
      setLoading(false);
      return;
    }

    // Basic validation
    if (!name || !email || !billingAddress.line1 || !billingAddress.city || !billingAddress.state || !billingAddress.postal_code) {
      setError('Please fill out all required fields, including email.');
      setLoading(false);
      return;
    }

    console.log('Submitting card payment with clientSecret:', clientSecret);
    // Create payment method with split elements and additional data
    const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardNumberElement),
      billing_details: {
        name,
        address: billingAddress,
        email,
      },
    });

    if (paymentMethodError) {
      setError(paymentMethodError.message);
      console.error('Payment method creation error:', paymentMethodError);
      setLoading(false);
      return;
    }

    // Confirm payment with the PaymentIntent
    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethod.id,
    });

    if (stripeError) {
      setError(stripeError.message);
      console.error('Card payment confirmation error:', stripeError);
      setLoading(false);
    } else if (paymentIntent.status === 'succeeded') {
      clearCart();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('appliedDiscount');
      }
      await sendOrderEmail(email, paymentIntent.id);
      console.log('Card payment confirmed:', { paymentIntentId: paymentIntent.id });
      window.location.href = '/success';
      setLoading(false);
    }
  };

  // Function to send order email
  const sendOrderEmail = async (recipientEmail, receiptNumber) => {
    const orderDetails = {
      items: Object.entries(cartDetails || {}).map(([id, item]) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price / 100,
      })),
      subtotal: (subtotal / 100).toFixed(2),
      discountCode: appliedDiscount.code,
      discountAmount: (discountAmount / 100).toFixed(2),
      shippingMethod: selectedShipping,
      shippingCost: (shippingCost / 100).toFixed(2),
      grandTotal: (grandTotal / 100).toFixed(2),
      billingAddress,
      shippingAddress,
      receiptNumber,
    };

    try {
      await fetch('/api/send-order-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: recipientEmail, orderDetails }),
      });
      console.log('Order email sent:', { recipientEmail, receiptNumber });
    } catch (err) {
      console.error('Error sending email:', err);
    }
  };

  if (!clientSecret && !error) {
    return (
      <Container className="py-20 text-center">
        <div className="mb-8">
          <Image
            src={logo}
            alt="Opti-Surge Logo"
            width={150}
            height={50}
            className="mx-auto"
          />
        </div>
        <p>Loading checkout... {cartReady ? '(Cart loaded, waiting for payment intent)' : '(Waiting for cart to load)'}</p>
      </Container>
    );
  }

  return (
    <Container className="py-20">
      <div className="mb-8">
        <Image
          src={logo}
          alt="Opti-Surge Logo"
          width={150}
          height={50}
          className="mx-auto"
        />
      </div>
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
        {/* Apple Pay / Google Pay Button */}
        {paymentRequest && (
          <div className="mb-6">
            <PaymentRequestButtonElement options={{ paymentRequest }} />
          </div>
        )}

        {/* Personal Information Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Personal Information</h2>
          <label className="block mb-2 font-semibold">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border rounded mb-3"
            placeholder="John Doe"
            required
          />
          <label className="block mb-2 font-semibold">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded"
            placeholder="you@example.com"
            required
          />
        </div>

        {/* Billing Address Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Billing Address</h2>
          <label className="block mb-2 font-semibold">Street Address</label>
          <input
            type="text"
            value={billingAddress.line1}
            onChange={(e) => setBillingAddress({ ...billingAddress, line1: e.target.value })}
            className="w-full p-3 border rounded mb-3"
            placeholder="123 Main St"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-semibold">City</label>
              <input
                type="text"
                value={billingAddress.city}
                onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })}
                className="w-full p-3 border rounded"
                placeholder="Anytown"
                required
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">State</label>
              <input
                type="text"
                value={billingAddress.state}
                onChange={(e) => setBillingAddress({ ...billingAddress, state: e.target.value })}
                className="w-full p-3 border rounded"
                placeholder="CA"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div>
              <label className="block mb-2 font-semibold">ZIP Code</label>
              <input
                type="text"
                value={billingAddress.postal_code}
                onChange={(e) => setBillingAddress({ ...billingAddress, postal_code: e.target.value })}
                className="w-full p-3 border rounded"
                placeholder="12345"
                required
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">Country</label>
              <input
                type="text"
                value={billingAddress.country}
                onChange={(e) => setBillingAddress({ ...billingAddress, country: e.target.value })}
                className="w-full p-3 border rounded"
                placeholder="US"
                required
              />
            </div>
          </div>
        </div>

        {/* Shipping Address Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
          <label className="flex items-center mb-3">
            <input
              type="checkbox"
              checked={sameAsBilling}
              onChange={(e) => setSameAsBilling(e.target.checked)}
              className="mr-2"
            />
            Same as billing address
          </label>
          {!sameAsBilling && (
            <>
              <label className="block mb-2 font-semibold">Street Address</label>
              <input
                type="text"
                value={shippingAddress.line1}
                onChange={(e) => setShippingAddress({ ...shippingAddress, line1: e.target.value })}
                className="w-full p-3 border rounded mb-3"
                placeholder="123 Main St"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-semibold">City</label>
                  <input
                    type="text"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    className="w-full p-3 border rounded"
                    placeholder="Anytown"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold">State</label>
                  <input
                    type="text"
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                    className="w-full p-3 border rounded"
                    placeholder="CA"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <label className="block mb-2 font-semibold">ZIP Code</label>
                  <input
                    type="text"
                    value={shippingAddress.postal_code}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, postal_code: e.target.value })}
                    className="w-full p-3 border rounded"
                    placeholder="12345"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold">Country</label>
                  <input
                    type="text"
                    value={shippingAddress.country}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                    className="w-full p-3 border rounded"
                    placeholder="US"
                    required
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Shipping Options Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Shipping Options</h2>
          <select
            value={selectedShipping}
            onChange={(e) => setSelectedShipping(e.target.value)}
            className="w-full p-3 border rounded"
          >
            {shippingOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label} - ${(opt.cost / 100).toFixed(2)}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Payment Information</h2>
          <label className="block mb-2 font-semibold">Card Number</label>
          <div className="p-3 border rounded mb-3">
            <CardNumberElement options={{ style: elementStyles }} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-semibold">Expiration Date</label>
              <div className="p-3 border rounded">
                <CardExpiryElement options={{ style: elementStyles }} />
              </div>
            </div>
            <div>
              <label className="block mb-2 font-semibold">CVV</label>
              <div className="p-3 border rounded">
                <CardCvcElement options={{ style: elementStyles }} />
              </div>
            </div>
          </div>
        </div>

        {/* Total with Discount and Shipping */}
        <div className="mb-6 text-right">
          <p>Subtotal: ${(subtotal / 100).toFixed(2)}</p>
          {appliedDiscount.percent > 0 && (
            <p>Discount ({appliedDiscount.code}): -${(discountAmount / 100).toFixed(2)}</p>
          )}
          <p>Shipping: ${(shippingCost / 100).toFixed(2)}</p>
          <p className="font-bold">Grand Total: ${(grandTotal / 100).toFixed(2)}</p>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        <Button type="submit" disabled={!stripe || loading || !clientSecret} className="w-full">
          {loading ? 'Processing...' : `Pay ${(grandTotal / 100).toFixed(2)}`}
        </Button>
      </form>
    </Container>
  );
}