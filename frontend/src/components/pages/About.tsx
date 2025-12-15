import { Image, Brain, Sparkles, Target, Layers, Eye } from "lucide-react";
import { Card } from "../ui/card";
import { ImageWithFallback } from "../figma/ImageWithFallback";

export function About() {
  const sections = [
    {
      icon: Image,
      title: "Image Preprocessing",
      description: "Medical images undergo rigorous preprocessing including CLAHE enhancement, normalization, noise reduction, and enhancement to ensure optimal analysis quality.",
      details: [
        "DICOM format support and conversion",
        "CLAHE (Contrast Limited Adaptive Histogram Equalization) for contrast enhancement",
        "Gaussian filtering for noise reduction",
        "Image resizing and standardization",
      ],
    },
    {
      icon: Brain,
      title: "Model Prediction",
      description: "State-of-the-art ResNet50 convolutional neural network architecture trained on thousands of mammogram images.",
      details: [
        "ResNet50 backbone architecture",
        "Transfer learning from ImageNet",
        "Fine-tuned on breast cancer datasets",
        "Ensemble predictions for higher accuracy",
      ],
    },
    {
      icon: Sparkles,
      title: "Explainable AI",
      description: "Multiple XAI techniques provide transparency into how the AI makes decisions, building trust with healthcare professionals.",
      details: [
        "Grad-CAM: Visual heatmaps of important regions",
        "LIME: Local interpretable model explanations",
        "SHAP: Feature importance analysis (available in research environment)",
        "Attention mechanism visualization",
      ],
    },
  ];

  const workflow = [
    { step: "1", title: "Data Ingestion", description: "Secure upload and validation" },
    { step: "2", title: "Preprocessing", description: "Image enhancement and normalization" },
    { step: "3", title: "Feature Extraction", description: "Deep learning feature detection" },
    { step: "4", title: "Classification", description: "AI model prediction" },
    { step: "5", title: "Explainability", description: "Generate visual explanations" },
    { step: "6", title: "Results", description: "Present findings to clinician" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-peach-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-gray-900 mb-4">About Rose Hearts</h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            An explainable AI system designed to assist healthcare professionals in early breast cancer 
            detection, reducing false positives and providing transparent, interpretable results.
          </p>
        </div>

        {/* Mission Statement */}
        <Card className="p-8 md:p-12 bg-white border-pink-100 shadow-lg mb-12">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
              <Target className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Our Mission</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                To empower healthcare professionals with AI-driven insights that are accurate, transparent, 
                and trustworthy. We believe that explainable AI is crucial in medical applications, where 
                understanding the "why" behind predictions can save lives and improve patient outcomes.
              </p>
            </div>
          </div>
        </Card>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">How the System Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sections.map((section, index) => (
              <Card key={index} className="flex flex-col h-full p-6 bg-white border-pink-100 shadow-md hover:shadow-xl transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-rose-100 to-pink-100 rounded-xl flex items-center justify-center mb-6">
                  <section.icon className="w-7 h-7 text-rose-600" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{section.title}</h3>
                <p className="text-gray-600 mb-6 flex-grow leading-relaxed">{section.description}</p>
                
                {/* Replaced <ul> with <div> stack to fix layout issues */}
                <div className="space-y-3 mt-auto pt-4 border-t border-gray-100">
                  {section.details.map((detail, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <span className="text-rose-500 text-lg leading-none mt-0.5">•</span>
                      <span className="text-sm text-gray-600 leading-snug">{detail}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Workflow Timeline */}
        <Card className="p-8 md:p-12 bg-white border-pink-100 shadow-lg mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Analysis Workflow</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {workflow.map((item, index) => (
              <div key={index} className="flex flex-col items-center text-center group">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center mb-4 text-white font-bold text-lg shadow-md group-hover:scale-110 transition-transform">
                  {item.step}
                </div>
                <h4 className="text-gray-900 font-semibold mb-2">{item.title}</h4>
                <p className="text-gray-500 text-sm leading-snug">{item.description}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Technical Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="flex flex-col h-full p-8 bg-white border-pink-100 shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-rose-50 rounded-lg">
                <Layers className="w-6 h-6 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Model Architecture</h3>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Our system uses <b>ResNet50</b>, a robust convolutional neural network that minimizes vanishing gradients for high-depth feature extraction.
            </p>
            <div className="space-y-4 mt-auto">
              <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                <span className="text-gray-600 font-medium">Architecture</span>
                <span className="text-gray-900 font-semibold">ResNet-50</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                <span className="text-gray-600 font-medium">Depth</span>
                <span className="text-gray-900 font-semibold">50 layers</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                <span className="text-gray-600 font-medium">Training Data</span>
                <span className="text-gray-900 font-semibold text-right">Composite (INbreast, MIAS, DDSM)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Focus</span>
                <span className="text-rose-600 font-bold">High Precision & Recall</span>
              </div>
            </div>
          </Card>

          <Card className="flex flex-col h-full p-8 bg-white border-pink-100 shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-rose-50 rounded-lg">
                <Eye className="w-6 h-6 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Explainability Methods</h3>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              We employ key XAI techniques to ensure our predictions are interpretable and trustworthy.
            </p>
            <div className="space-y-4 mt-auto">
              <div className="p-4 bg-rose-50 rounded-xl border border-rose-100">
                <h4 className="text-rose-900 font-semibold mb-1">Grad-CAM</h4>
                <p className="text-rose-700 text-sm">Visual heatmaps highlighting important image regions in real-time.</p>
              </div>
              <div className="p-4 bg-pink-50 rounded-xl border border-pink-100">
                <h4 className="text-pink-900 font-semibold mb-1">LIME</h4>
                <p className="text-pink-700 text-sm">Local interpretable model-agnostic explanations showing feature importance.</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Visual Banner */}
        <Card className="overflow-hidden border-pink-100 shadow-lg rounded-2xl">
          <div className="relative h-64 md:h-80">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1617049037028-d4746ed5e6bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwdmlzdWFsaXphdGlvbiUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzYyNTcyMDQwfDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="AI Technology Visualization"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-rose-900/90 to-pink-900/80 flex items-center justify-center p-6">
              <div className="text-center text-white max-w-2xl">
                <h2 className="text-3xl font-bold mb-4">Powered by Advanced AI</h2>
                <p className="text-lg opacity-90 leading-relaxed">
                  Combining deep learning, computer vision, and explainable AI to deliver 
                  accurate and transparent breast cancer detection.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}