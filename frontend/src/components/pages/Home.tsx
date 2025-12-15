import { Upload, BookOpen, CheckCircle, Target, Sparkles, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { ImageWithFallback } from "../figma/ImageWithFallback";

export function Home() {
  const steps = [
    {
      icon: Upload,
      title: "Upload",
      description: "Upload medical imaging securely to our platform",
    },
    {
      icon: Sparkles,
      title: "Analyze",
      description: "AI analyzes the image using advanced deep learning models",
    },
    {
      icon: CheckCircle,
      title: "View Results",
      description: "Get explainable predictions with visual heatmaps",
    },
  ];

  const features = [
    {
      icon: Target,
      title: "Accuracy",
      description: "State-of-the-art deep learning models with high precision and recall",
    },
    {
      icon: Sparkles,
      title: "Explainability",
      description: "Grad-CAM, LIME, and SHAP visualizations to understand AI decisions",
    },
    {
      icon: Shield,
      title: "Trust",
      description: "Secure, HIPAA-compliant platform designed for healthcare professionals",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-rose-50 via-pink-50 to-peach-50 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1722811722309-d4c8c09156cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHBpbmslMjBncmFkaWVudHxlbnwxfHx8fDE3NjI1NzQ1NzN8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Background pattern"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center space-y-8">
            <div className="inline-block px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-rose-600 text-sm border border-pink-200">
              Explainable AI for Healthcare
            </div>
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-pink-900 max-w-4xl mx-auto tracking-tight">
              Rose Hearts
            </h1>
            
            <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 max-w-2xl mx-auto">
              AI-powered Breast Cancer Detection System
            </p>
            
            <p className="text-gray-600 max-w-2xl mx-auto">
              Leveraging cutting-edge deep learning and explainable AI to assist healthcare professionals 
              in early breast cancer detection with transparency and trust.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/upload">
                <Button size="lg" className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-lg shadow-pink-200">
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Image
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="border-rose-300 text-rose-700 hover:bg-rose-50">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Process */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our streamlined process makes AI-powered diagnosis simple and transparent
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <Card key={index} className="p-8 text-center space-y-4 border-pink-100 hover:shadow-lg hover:shadow-pink-100 transition-all">
                <div className="w-16 h-16 bg-gradient-to-br from-rose-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto">
                  <step.icon className="w-8 h-8 text-rose-600" />
                </div>
                <h3 className="text-gray-900">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Rose Hearts */}
      <section className="py-20 bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-gray-900 mb-4">Why Choose Rose Hearts?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Built with the latest AI technology and healthcare professionals in mind
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-pink-100 space-y-4">
                <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-rose-500 to-pink-500 rounded-3xl p-12 shadow-2xl shadow-pink-200 text-white">
            <h2 className="mb-4">Ready to Get Started?</h2>
            <p className="mb-8 opacity-90">
              Upload your first image and experience the power of explainable AI
            </p>
            <Link to="/upload">
              <Button size="lg" variant="secondary" className="bg-white text-rose-600 hover:bg-gray-100">
                <Upload className="w-5 h-5 mr-2" />
                Start Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
