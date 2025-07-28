'use client'; // This makes it a Client Component for hooks and interactivity

import { useState } from 'react'; // Add for useState
import { useShoppingCart } from 'use-shopping-cart';
import { Button } from '@/components/Button'; // Assuming you have this from your existing components
import { Container } from '@/components/Container'; // Reuse your Container for consistency
import Link from 'next/link'; // Add for linking to checkout

export default function CartPage() {
  const { cartDetails, totalPrice, removeItem, cartCount, setItemQuantity } = useShoppingCart();

  // Convert cartDetails object to array for easier mapping
  const cartItems = Object.entries(cartDetails || {}).map(([id, item]) => item);

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(itemId); // Remove if quantity is 0 or less
    } else {
      setItemQuantity(itemId, newQuantity);
    }
  };

  // Discount state
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0); // Percentage discount
  const [discountError, setDiscountError] = useState(null);

  // Hardcoded discount codes (for different promotions; add more as needed)
  const discounts = {
    'PROMO10': 10, // 10% off
    'SUMMER20': 20, // 20% off
    'WELCOME15': 15, // 15% off for new users
  };

  const handleApplyDiscount = () => {
    const upperCode = discountCode.toUpperCase();
    const percent = discounts[upperCode];
    if (percent) {
      setAppliedDiscount(percent);
      setDiscountError(null);
      // Store discount in localStorage for checkout
      localStorage.setItem('appliedDiscount', JSON.stringify({ code: upperCode, percent }));
    } else {
      setAppliedDiscount(0);
      setDiscountError('Invalid discount code');
      localStorage.removeItem('appliedDiscount');
    }
  };

  // Calculate totals with discount
  const subtotal = totalPrice;
  const discountAmount = (subtotal * appliedDiscount) / 100;
  const discountedTotal = subtotal - discountAmount;

  if (cartCount === 0) {
    return (
      <Container className="py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p>Go back to the homepage to add items.</p>
        <Button href="/" className="mt-4">Continue Shopping</Button>
      </Container>
    );
  }

  return (
    <Container className="py-20">
      <h1 className="text-3xl font-bold mb-8 text-center">Shopping Cart</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center mb-4 p-4 border rounded-lg">
              <div>
                <h2 className="font-semibold">{item.name}</h2>
                <p className="text-gray-600">Quantity: {item.quantity}</p>
                <p className="text-gray-600">Price: ${(item.price / 100).toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">${((item.price * item.quantity) / 100).toFixed(2)}</p>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:underline mt-2"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="flex justify-between mb-2">
            <span>Subtotal:</span>
            <span>${(subtotal / 100).toFixed(2)}</span>
          </div>
          {/* Discount Input */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Discount Code</label>
            <div className="flex">
              <input
                type="text"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                className="w-full p-2 border rounded-l"
                placeholder="Enter code"
              />
              <button
                onClick={handleApplyDiscount}
                className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600"
              >
                Apply
              </button>
            </div>
            {discountError && <p className="text-red-500 mt-1">{discountError}</p>}
            {appliedDiscount > 0 && <p className="text-green-500 mt-1">{appliedDiscount}% discount applied</p>}
          </div>
          <div className="flex justify-between mb-2">
            <span>Discount:</span>
            <span>-${(discountAmount / 100).toFixed(2)}</span>
          </div>
          {/* Add taxes/shipping if configured */}
          <div className="flex justify-between font-bold text-lg mt-4">
            <span>Total:</span>
            <span>${(discountedTotal / 100).toFixed(2)}</span>
          </div>
          <Link href="/checkout">
            <Button className="w-full mt-6">Proceed to Checkout</Button>
          </Link>
        </div>
      </div>
    </Container>
  );
}