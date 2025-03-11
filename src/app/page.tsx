import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import {
  ArrowUpRight,
  Brain,
  HeartPulse,
  Shield,
  Stethoscope,
  Users,
} from "lucide-react";
import { createClient } from "../../supabase/server";
import Image from "next/image";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Navbar />
      <Hero />

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose VAI Health</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're revolutionizing healthcare with AI-powered consultations and
              seamless connections to medical professionals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Brain className="w-6 h-6" />,
                title: "AI-Powered Consultations",
                description:
                  "Get initial assessments from our specialized medical AI",
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: "HIPAA Compliant",
                description:
                  "Your data is protected with end-to-end encryption",
              },
              {
                icon: <Stethoscope className="w-6 h-6" />,
                title: "Doctor Handoff",
                description: "Seamless transition from AI to human doctors",
              },
              {
                icon: <HeartPulse className="w-6 h-6" />,
                title: "Health Monitoring",
                description: "Track your vital metrics and health goals",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-blue-100"
              >
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How VAI Health Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform combines AI technology with human expertise to
              provide comprehensive healthcare solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 rounded-full p-6 mb-6">
                <Brain className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. AI Consultation</h3>
              <p className="text-gray-600">
                Describe your symptoms to our medical AI for an initial
                assessment and recommendations.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 rounded-full p-6 mb-6">
                <Stethoscope className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Doctor Review</h3>
              <p className="text-gray-600">
                A qualified healthcare professional reviews the AI assessment
                and provides expert guidance.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 rounded-full p-6 mb-6">
                <HeartPulse className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Ongoing Care</h3>
              <p className="text-gray-600">
                Schedule appointments, track your health metrics, and maintain
                secure communication with your providers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">What Our Patients Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from people who have experienced the benefits of our
              AI-enabled healthcare platform.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "The AI consultation was surprisingly accurate, and I was able to connect with a doctor within minutes. Incredible service!",
                name: "Sarah Johnson",
                title: "Patient",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
              },
              {
                quote:
                  "As someone with chronic conditions, being able to track my health metrics and have them reviewed by my doctor remotely has been life-changing.",
                name: "Michael Chen",
                title: "Patient",
                avatar:
                  "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
              },
              {
                quote:
                  "The seamless handoff from AI assessment to doctor consultation saved me time and gave me peace of mind about my symptoms.",
                name: "Emily Rodriguez",
                title: "Patient",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
              },
            ].map((testimonial, index) => (
              <div key={index} className="p-6 bg-blue-50 rounded-xl shadow-sm">
                <div className="flex flex-col h-full">
                  <p className="text-gray-700 italic mb-6 flex-grow">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4 bg-blue-100 flex items-center justify-center">
                      <div className="text-blue-600 font-bold">
                        {testimonial.name.charAt(0)}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">
                        {testimonial.title}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-blue-100">Patient Satisfaction</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5,000+</div>
              <div className="text-blue-100">Consultations Completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">AI Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Take Control of Your Health Today
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of patients who trust VAI Health with their
            healthcare needs.
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Started Now
            <ArrowUpRight className="ml-2 w-4 h-4" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
