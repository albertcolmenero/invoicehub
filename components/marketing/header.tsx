import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Header() {
  return (
    <header className="py-4 px-4 md:px-6 lg:px-8">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          SaaSCo
        </Link>
        <nav className="hidden md:flex space-x-4">
          <Link href="#features" className="text-sm font-medium hover:underline">
            Features
          </Link>
          <Link href="#pricing" className="text-sm font-medium hover:underline">
            Pricing
          </Link>
          <Link href="#" className="text-sm font-medium hover:underline">
            About
          </Link>
        </nav>
        <div className="flex space-x-2">
            <Link href="/sign-in?redirect_url=/app">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/sign-up?redirect_url=/app">
              <Button>Get Started</Button>
            </Link>
        </div>
      </div>
    </header>
  )
}

