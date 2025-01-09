import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Zap, Shield, BarChart } from 'lucide-react'

const features = [
  {
    title: 'Lightning Fast',
    description: 'Our platform is optimized for speed, ensuring quick load times and responsive interactions.',
    icon: Zap,
  },
  {
    title: 'Secure & Reliable',
    description: 'Your data is protected with industry-leading security measures and regular backups.',
    icon: Shield,
  },
  {
    title: 'Advanced Analytics',
    description: 'Gain valuable insights with our powerful analytics tools and customizable dashboards.',
    icon: BarChart,
  },
]

export default function Features() {
  return (
    <section id="features" className="py-20 px-4 md:px-6 lg:px-8 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Powerful Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <feature.icon className="w-10 h-10 mb-4 text-purple-600" />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

