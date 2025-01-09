import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4 md:px-6 lg:px-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">SaaSCo</h3>
          <p className="text-sm text-gray-400">
            Empowering businesses with innovative SaaS solutions.
          </p>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <Link href="#" className="text-sm text-gray-400 hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link href="#features" className="text-sm text-gray-400 hover:text-white">
                Features
              </Link>
            </li>
            <li>
              <Link href="#pricing" className="text-sm text-gray-400 hover:text-white">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="#" className="text-sm text-gray-400 hover:text-white">
                About Us
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
          <p className="text-sm text-gray-400 mb-2">contact@saasco.com</p>
          <p className="text-sm text-gray-400">123 SaaS Street, Tech City, 12345</p>
        </div>
      </div>
      <div className="container mx-auto mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} SaaSCo. All rights reserved.
      </div>
    </footer>
  )
}

