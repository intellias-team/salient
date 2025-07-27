import Link from 'next/link'
import Image from 'next/image'
import { Container } from '@/components/Container'
import { Logo } from '@/components/Logo'
import { NavLink } from '@/components/NavLink'
import logoImage from '@/images/logo.png' // Import from src/images/

export function Footer() {
  return (
    <footer className="bg-slate-50">
      <Container>
        <div className="py-16">
            <Link href="#" aria-label="Home">
              <Image src={logoImage} alt="Company Logo" width={60} height={100} className="mx-auto h-25 w-auto" unoptimized />
            </Link>
          <nav className="mt-10 text-sm" aria-label="quick links">
            <div className="-my-1 flex justify-center gap-x-6">
              <NavLink href="#features">Features</NavLink>
              <NavLink href="#testimonials">Testimonials</NavLink>
              <NavLink href="#pricing">Pricing</NavLink>
            </div>
          </nav>
        </div>
        <div className="flex flex-col items-center border-t border-slate-400/10 py-10 sm:flex-row-reverse sm:justify-between">
          <div className="flex gap-x-6">
          </div>
          <p className="mt-6 text-sm text-slate-500 sm:mt-0">
            Copyright &copy; {new Date().getFullYear()} Opti-Surge. All rights
            reserved.
          </p>
        </div>
      </Container>
    </footer>
  )
}
