import { Download, Upload, Info, XCircle, CheckCircle, Loader2, Activity, AlertCircle, AlertTriangle } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useEffect, useState, useMemo } from "react";
import { jsPDF } from "jspdf";

// --- Configuration ---
const API_BASE_URL = "http://127.0.0.1:8000";

interface PredictionData {
  prediction: string;
  confidence: string;
  probabilities: {
    Benign: string;
    Malignant: string;
    Normal: string;
  };
}

interface ResultsState {
  prediction: PredictionData;
  originalImage: string; 
}

interface XAIImages {
    gradcam_image_base64: string;
    lime_image_base64: string;
}

export function Results() {
  const location = useLocation();
  const navigate = useNavigate();

  const [results, setResults] = useState<PredictionData | null>(null);
  const [originalImageURL, setOriginalImageURL] = useState<string | null>(null);
  const [xaiImages, setXaiImages] = useState<XAIImages | null>(null);
  const [isXaiLoading, setIsXaiLoading] = useState(false);
  const [xaiError, setXaiError] = useState<string | null>(null);

  // --- Effect 1: Load Prediction Data ---
  useEffect(() => {
    const state = location.state as ResultsState | null;
    if (!state || !state.prediction || !state.originalImage) {
      console.error("Missing prediction state, redirecting.");
      navigate("/upload");
      return;
    }
    setResults(state.prediction);
    setOriginalImageURL(state.originalImage);
  }, [location, navigate]);

  // --- Effect 2: Fetch XAI Images ---
  useEffect(() => {
    if (!results) return;

    const fetchXAI = async () => {
        setIsXaiLoading(true);
        setXaiError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/explain_all`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `HTTP error! Status: ${response.status}`);
            }
            const data: XAIImages = await response.json();
            setXaiImages(data);
        } catch (error) {
            console.error("XAI fetch failed:", error);
            setXaiError(`Failed to load explanations: ${error instanceof Error ? error.message : "Network error"}`);
        } finally {
            setIsXaiLoading(false);
        }
    };
    fetchXAI();
  }, [results]);

  // --- Logic: Styles & Content ---
  const { predictionLabel, confidenceValue, predictionStatus, confidencePercent } = useMemo(() => {
    if (!results) return {} as any;

    const rawLabel = results.prediction.toLowerCase();
    const displayLabel = rawLabel.charAt(0).toUpperCase() + rawLabel.slice(1);
    const confidence = parseFloat(results.confidence);
    const confidencePercent = `${confidence.toFixed(2)}%`;

    const statusBasedOnClass: "low-risk" | "high-risk" | "normal" =
      rawLabel === "malignant" ? "high-risk" :
      rawLabel === "benign" ? "low-risk" : "normal";

    return {
      predictionLabel: displayLabel,
      confidenceValue: confidence,
      predictionStatus: statusBasedOnClass,
      confidencePercent: confidencePercent,
    };
  }, [results]);

  const getStyle = (type: string) => {
    switch (type) {
      case "low-risk": return { icon: <CheckCircle className="w-8 h-8 text-green-500" />, badge: "bg-green-100 text-green-700 border-green-200", alert: "border-green-200 bg-green-50", iconColor: "text-green-600", textColor: "text-green-900", description: "The AI model indicates a low probability of malignancy. This result should be reviewed by a specialist." };
      case "high-risk": return { icon: <XCircle className="w-8 h-8 text-red-500" />, badge: "bg-red-100 text-red-700 border-red-200", alert: "border-red-200 bg-red-50", iconColor: "text-red-600", textColor: "text-red-900", description: "The AI model has detected high probability of malignancy. Immediate consultation with a healthcare professional is recommended." };
      case "normal": return { icon: <Info className="w-8 h-8 text-blue-500" />, badge: "bg-blue-100 text-blue-700 border-blue-200", alert: "border-blue-200 bg-blue-50", iconColor: "text-blue-600", textColor: "text-blue-900", description: "The AI model indicates normal tissue. Routine follow-up is recommended." };
      default: return {} as any;
    }
  };

  const style = getStyle(predictionStatus);

  // --- PDF Generation Helper ---
  const convertBlobToBase64 = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = url;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/jpeg"));
      };
      img.onerror = reject;
    });
  };

  // --- PDF Download Handler ---
  const handleDownloadReport = async () => {
    if (!results) return;

    const doc = new jsPDF();
    const margin = 20;
    let yPos = 20;

    // 1. Header
    doc.setFontSize(22);
    doc.setTextColor(225, 29, 72); // Rose-600
    doc.text("Rose Hearts AI Analysis Report", margin, yPos);
    yPos += 10;

    // 2. Meta Data
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Date: ${new Date().toLocaleString()}`, margin, yPos);
    yPos += 15;

    // 3. Diagnosis Section
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Diagnosis Results", margin, yPos);
    yPos += 8;

    doc.setFontSize(12);
    doc.text(`Prediction: ${predictionLabel}`, margin, yPos);
    yPos += 6;
    doc.text(`Confidence: ${confidencePercent}`, margin, yPos);
    yPos += 10;

    doc.setFontSize(12);
    doc.text("Detailed Probabilities:", margin, yPos);
    yPos += 6;
    doc.setFontSize(10);
    doc.text(`- Benign: ${results.probabilities.Benign}%`, margin + 5, yPos);
    yPos += 5;
    doc.text(`- Malignant: ${results.probabilities.Malignant}%`, margin + 5, yPos);
    yPos += 5;
    doc.text(`- Normal: ${results.probabilities.Normal}%`, margin + 5, yPos);
    yPos += 15;

    // 4. Images Section
    doc.setFontSize(14);
    doc.text("Visual Explanations", margin, yPos);
    yPos += 10;

    try {
      const imgWidth = 50;
      const imgHeight = 50;
      const spacing = 10;
      let currentX = margin;

      // A. Original Image (Convert Blob to Base64 first)
      if (originalImageURL) {
        const originalBase64 = await convertBlobToBase64(originalImageURL);
        doc.addImage(originalBase64, "JPEG", currentX, yPos, imgWidth, imgHeight);
        doc.setFontSize(10);
        doc.text("Original", currentX + 15, yPos + imgHeight + 5);
        currentX += imgWidth + spacing;
      }

      // B. Grad-CAM
      if (xaiImages?.gradcam_image_base64) {
        doc.addImage(
          `data:image/jpeg;base64,${xaiImages.gradcam_image_base64}`, 
          "JPEG", 
          currentX, 
          yPos, 
          imgWidth, 
          imgHeight
        );
        doc.text("Grad-CAM", currentX + 12, yPos + imgHeight + 5);
        currentX += imgWidth + spacing;
      }

      // C. LIME
      if (xaiImages?.lime_image_base64) {
        doc.addImage(
          `data:image/jpeg;base64,${xaiImages.lime_image_base64}`, 
          "JPEG", 
          currentX, 
          yPos, 
          imgWidth, 
          imgHeight
        );
        doc.text("LIME", currentX + 18, yPos + imgHeight + 5);
      }

    } catch (error) {
      console.error("Error generating PDF images:", error);
      doc.text("Error: Could not load images for report.", margin, yPos + 20);
    }

    // 5. Footer / Disclaimer
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFontSize(8);
    doc.setTextColor(150);
    const disclaimer = "Medical Disclaimer: This AI analysis is a screening tool and should not replace professional medical diagnosis. Always consult with a qualified healthcare provider";
    doc.text(disclaimer, margin, pageHeight - 10);

    // Save
    doc.save(`RoseHearts_Report_${new Date().toISOString().slice(0,10)}.pdf`);
  };

  if (!results || isXaiLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-peach-50">
            <div className="text-center p-8">
                <Loader2 className="w-10 h-10 animate-spin text-rose-600 mx-auto mb-4" />
                <h2 className="text-gray-900">Generating Explainable AI Insights...</h2>
                <p className="text-gray-600">This may take up to 20 seconds for complex models like LIME/Grad-CAM.</p>
            </div>
        </div>
    );
  }

  // Image Sources
  const gradcamSrc = xaiImages?.gradcam_image_base64 ? `data:image/jpeg;base64,${xaiImages.gradcam_image_base64}` : originalImageURL;
  const limeSrc = xaiImages?.lime_image_base64 ? `data:image/jpeg;base64,${xaiImages.lime_image_base64}` : originalImageURL;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-peach-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-gray-900 mb-4">Analysis Results</h1>
          <p className="text-gray-600">AI-powered diagnosis with explainable insights</p>
        </div>

        {xaiError && (
            <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertTitle className="text-red-900">XAI Error</AlertTitle>
                <AlertDescription className="text-red-900">{xaiError}</AlertDescription>
            </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Results */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 md:p-8 bg-white border-pink-100 shadow-lg">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-gray-900 mb-2">Prediction</h2>
                  <div className="flex items-center gap-3">
                    <Badge className={style.badge}>{predictionLabel}</Badge>
                    <span className="text-gray-600">Confidence: <span className="text-gray-900">{confidencePercent}</span></span>
                  </div>
                </div>
                {style.icon}
              </div>
              <Alert className={style.alert}>
                <Activity className={`h-4 w-4 ${style.iconColor}`} />
                <AlertDescription className={style.textColor}>{style.description}</AlertDescription>
              </Alert>
            </Card>

            {/* Grad-CAM Heatmap */}
            <Card className="p-6 md:p-8 bg-white border-pink-100 shadow-lg">
              <h2 className="text-gray-900 mb-4">Grad-CAM Heatmap</h2>
              <p className="text-gray-600 mb-6">Visual explanation showing which regions the AI model focused on.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-gray-700">Original Image</p>
                  <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                    <img src={originalImageURL || ""} alt="Original" className="w-full h-full object-contain" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-700">Heatmap Overlay</p>
                  <div className="aspect-square bg-gradient-to-br from-rose-100 via-pink-100 to-orange-100 rounded-xl overflow-hidden">
                    <img src={gradcamSrc || ""} alt="Grad-CAM" className="w-full h-full object-contain" />
                  </div>
                </div>
              </div>
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-900 text-sm"><strong>What is Grad-CAM?</strong> Gradient-weighted Class Activation Mapping highlights 
                  the important regions in the image that influenced the AI's decision. Warmer colors (red/orange) 
                  indicate higher importance.</p>
              </div>
            </Card>

            {/* LIME Visualization */}
            <Card className="p-6 md:p-8 bg-white border-pink-100 shadow-lg">
              <h2 className="text-gray-900 mb-4">LIME Explanation</h2>
              <p className="text-gray-600 mb-6">Local Interpretable Model-agnostic Explanations showing feature importance.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-gray-700">Original Image</p>
                  <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                    <img src={originalImageURL || ""} alt="Original" className="w-full h-full object-contain" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-700">LIME Segmentation</p>
                  <div className="aspect-square bg-gradient-to-br from-purple-100 via-indigo-100 to-blue-100 rounded-xl overflow-hidden">
                    <img src={limeSrc || ""} alt="LIME" className="w-full h-full object-contain" />
                  </div>
                </div>
              </div>
              <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-purple-900 text-sm"><strong>What is LIME?</strong> LIME explains individual predictions by approximating the model 
                  locally with an interpretable model. It highlights superpixels that contribute positively (green) 
                  or negatively (red) to the prediction.</p>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6 bg-white border-pink-100 shadow-lg">
              <h3 className="text-gray-900 mb-4">Model Performance</h3>
              <div className="space-y-4">
                {results && Object.entries(results.probabilities).map(([label, value]) => (
                    <div key={label} className="flex justify-between items-center">
                        <span className="text-gray-600">{label} Probability</span>
                        <span className={`font-medium ${label === predictionLabel ? 'text-rose-600' : 'text-gray-800'}`}>{value}%</span>
                    </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-lg">
              <h3 className="mb-4">Next Steps</h3>
              <div className="space-y-3">
                <Button variant="secondary" className="w-full bg-white text-rose-600 hover:bg-gray-100" onClick={handleDownloadReport}>
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF Report
                </Button>
                <Link to="/upload" className="block">
                  <Button variant="outline" className="w-full border-white bg-transparent text-white hover:bg-white hover:text-rose-600">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Another
                  </Button>
                </Link>
              </div>
            </Card>

            <Card className="p-6 bg-amber-50 border-amber-200">
              <p className="text-amber-900 text-sm">
                <strong>Medical Disclaimer:</strong> This AI analysis is a screening tool 
                and should not replace professional medical diagnosis. Always consult with 
                a qualified healthcare provider.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}