import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function Hero() {
  return (
    <section className="py-20 px-4 md:px-6 lg:px-8 bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          Supercharge Your Workflow
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
          Boost productivity and streamline your processes with our cutting-edge SaaS solution.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Input
            type="email"
            placeholder="Enter your email"
            className="max-w-xs bg-white text-black"
          />
          <Button size="lg" className="bg-yellow-400 text-black hover:bg-yellow-300">
            Get Started
          </Button>
        </div>
      </div>
    </section>
  )
}

