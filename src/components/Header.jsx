'use client'

import Link from 'next/link'
import Image from 'next/image'
import logoImage from '@/images/logo.png' // Import from src/images/

import {
  Popover,
  PopoverButton,
  PopoverBackdrop,
  PopoverPanel,
} from '@headlessui/react'
import clsx from 'clsx'

import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { Logo } from '@/components/Logo'
import { NavLink } from '@/components/NavLink'
import { useShoppingCart } from 'use-shopping-cart'; // Add this import for cart count

function MobileNavLink({ href, children }) {
  return (
    <PopoverButton as={Link} href={href} className="block w-full p-2">
      {children}
    </PopoverButton>
  )
}

function MobileNavIcon({ open }) {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5 overflow-visible stroke-slate-700"
      fill="none"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <path
        d="M0 1H14M0 7H14M0 13H14"
        className={clsx(
          'origin-center transition',
          open && 'scale-90 opacity-0',
        )}
      />
      <path
        d="M2 2L12 12M12 2L2 12"
        className={clsx(
          'origin-center transition',
          !open && 'scale-90 opacity-0',
        )}
      />
    </svg>
  )
}

function MobileNavigation() {
  return (
    <Popover>
      <PopoverButton
        className="relative z-10 flex h-8 w-8 items-center justify-center focus:not-data-focus:outline-hidden"
        aria-label="Toggle Navigation"
      >
        {({ open }) => <MobileNavIcon open={open} />}
      </PopoverButton>
      <PopoverBackdrop
        transition
        className="fixed inset-0 bg-slate-300/50 duration-150 data-closed:opacity-0 data-enter:ease-out data-leave:ease-in"
      />
      <PopoverPanel
        transition
        className="absolute inset-x-0 top-full mt-4 flex origin-top flex-col rounded-2xl bg-white p-4 text-lg tracking-tight text-slate-900 shadow-xl ring-1 ring-slate-900/5 data-closed:scale-95 data-closed:opacity-0 data-enter:duration-150 data-enter:ease-out data-leave:duration-100 data-leave:ease-in"
      >
        <MobileNavLink href="#primaryfeatures">About</MobileNavLink>
        <MobileNavLink href="#ingredients">Ingredients</MobileNavLink>
        <MobileNavLink href="#testimonials">Testimonials</MobileNavLink>
        <MobileNavLink href="#reviews">Reviews</MobileNavLink>
        <MobileNavLink href="#pricing">Pricing</MobileNavLink>
        <MobileNavLink href="#faq">FAQ</MobileNavLink>
      </PopoverPanel>
    </Popover>
  )
}

export function Header() {
  const { cartCount } = useShoppingCart(); // Get cart count from the hook

  return (
    <header className="py-0">
      <Container>
        <nav className="relative z-50 flex justify-between">
          <div className="flex items-center md:gap-x-12">
            <Link href="#" aria-label="Home">
              <Image src={logoImage} alt="Company Logo" width={60} height={100} className="h-25 w-auto" unoptimized />
            </Link>
            <div className="hidden md:flex md:gap-x-6">
              <NavLink href="#features">About</NavLink>
              <NavLink href="#ingredients">Ingredients</NavLink>
              <NavLink href="#testimonials">Testimonials</NavLink>
              <NavLink href="#reviews">Reviews</NavLink>
              <NavLink href="#pricing">Pricing</NavLink>
              <NavLink href="#faq">FAQ</NavLink>
            </div>
          </div>
          <div className="flex items-center gap-x-5 md:gap-x-8">
            <Button href="/cart" color="blue"> {/* Changed href to /cart */}
              <span>
                Cart ({cartCount || 0}) {/* Display cart count */}
              </span>
            </Button>
            <div className="-mr-1 md:hidden">
              <MobileNavigation />
            </div>
          </div>
        </nav>
      </Container>
    </header>
  )
}