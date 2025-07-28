import { Inter, Lexend } from 'next/font/google'
import clsx from 'clsx'

import '@/styles/tailwind.css'
import CartProviderClient from '@/components/CartProviderClient'; // Import the new client provider

export const metadata = {
  title: {
    template: '%s - TaxPal',
    default: 'Opti-Surge - Optimize Your Testosterone',
  },
  description:
    'All natural fenugreek seed testosterone booster.',
}

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const lexend = Lexend({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lexend',
})

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={clsx(
        'h-full scroll-smooth bg-white antialiased',
        inter.variable,
        lexend.variable,
      )}
    >
      <body className="flex h-full flex-col">
        <CartProviderClient>
          {children}
        </CartProviderClient>
      </body>
    </html>
  )
}