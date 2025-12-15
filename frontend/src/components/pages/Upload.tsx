import { useState, useCallback, useRef } from "react"; // Added useRef
import { Upload as UploadIcon, FileImage, Shield, Loader2, AlertCircle } from "lucide-react"; // Added AlertCircle to imports
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Progress } from "../ui/progress";
import { Alert, AlertDescription } from "../ui/alert";

// --- Configuration ---
const API_BASE_URL = "http://127.0.0.1:8000"; 
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

interface PredictionResponse {
  prediction: string;
  confidence: string;
  probabilities: {
    Benign: string;
    Malignant: string;
    Normal: string;
  };
}

export function Upload() {
  const navigate = useNavigate();
  // 1. Create a reference for the file input
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);

  // --- Drag and Drop Handlers ---
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const setFileWithPreview = (selectedFile: File) => {
    if (selectedFile.size > MAX_FILE_SIZE) {
      setUploadError("File size exceeds the 10MB limit.");
      setFile(null);
      setPreviewURL(null);
      return;
    }
    if (selectedFile.type !== "image/jpeg" && selectedFile.type !== "image/png") {
        setUploadError("Invalid file format. Please upload JPG or PNG.");
        setFile(null);
        setPreviewURL(null);
        return;
    }
    setUploadError(null);
    setFile(selectedFile);
    setPreviewURL(URL.createObjectURL(selectedFile));
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFileWithPreview(droppedFile);
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFileWithPreview(selectedFile);
    }
  }, []);

  // --- API Submission Handler ---
  const handleSubmit = useCallback(async () => {
    if (!file) return;

    setIsProcessing(true);
    setUploadError(null);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! Status: ${response.status}`);
      }

      const predictionData: PredictionResponse = await response.json();
      
      navigate("/results", {
        state: {
          prediction: predictionData,
          originalImage: previewURL,
        },
      });

    } catch (error) {
      console.error("Upload failed:", error);
      setUploadError(`Analysis failed: ${error instanceof Error ? error.message : "Network error"}`);
    } finally {
      setIsProcessing(false);
    }
  }, [file, navigate, previewURL]);

  // 2. Handler to trigger the hidden input click
  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-peach-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-gray-900 mb-4">Upload Medical Image</h1>
          <p className="text-gray-600">
            Upload a mammogram image for AI-powered analysis
          </p>
        </div>

        <Card className="p-8 md:p-12 bg-white border-pink-100 shadow-lg">
          {/* Drag and Drop Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
              isDragging
                ? "border-rose-400 bg-rose-50"
                : "border-pink-200 bg-gradient-to-br from-rose-50/50 to-pink-50/50"
            }`}
          >
            {file ? (
              <div className="space-y-4">
                <div className="w-40 h-40 rounded-xl overflow-hidden mx-auto mb-4 border-2 border-pink-300">
                    {/* Display Image Preview */}
                    {previewURL && (
                        <img src={previewURL} alt="Preview" className="w-full h-full object-contain" />
                    )}
                </div>
                <div>
                  <p className="text-gray-900 font-medium">{file.name}</p>
                  <p className="text-gray-500 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {setFile(null); setPreviewURL(null);}}
                  className="border-pink-200 text-gray-600 hover:bg-rose-50"
                >
                  Choose Different File
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-rose-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto">
                  <UploadIcon className="w-8 h-8 text-rose-600" />
                </div>
                <div>
                  <p className="text-gray-900 mb-2">
                    Drag and drop your **JPG/PNG** image here
                  </p>
                  <p className="text-gray-500 text-sm mb-4">or</p>
                  
                  {/* 3. Fixed Button Implementation */}
                  <Button
                    type="button"
                    variant="outline"
                    className="border-rose-300 text-rose-700 hover:bg-rose-50"
                    onClick={handleBrowseClick} // Use explicit click handler
                  >
                    Browse Files
                  </Button>
                  
                  {/* 4. Hidden Input with Ref */}
                  <input
                    ref={fileInputRef}
                    id="file-input"
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </div>
                <p className="text-gray-500 text-sm">
                  Accepted formats: .jpg, .png (Max 10MB)
                </p>
              </div>
            )}
          </div>
          
          {/* Error Message */}
          {uploadError && (
              <Alert variant="destructive" className="mt-6 border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-900">
                      <strong>Error:</strong> {uploadError}
                  </AlertDescription>
              </Alert>
          )}

          {/* Upload Progress */}
          {isProcessing && (
            <div className="mt-6 space-y-2 text-center">
              <Loader2 className="h-6 w-6 animate-spin text-rose-500 mx-auto" />
              <p className="text-gray-600">Analyzing image. This may take a few seconds...</p>
              <Progress value={50} className="h-2 bg-rose-200" />
            </div>
          )}

          {/* Submit Button */}
          <div className="mt-8">
            <Button
              onClick={handleSubmit}
              disabled={!file || isProcessing || !!uploadError}
              className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-lg shadow-pink-200"
              size="lg"
            >
              {isProcessing ? "Processing..." : "Submit for Analysis"}
            </Button>
          </div>

          {/* Privacy Notice */}
          <Alert className="mt-8 border-blue-200 bg-blue-50">
            <Shield className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-900">
              <strong>Data Privacy:</strong> Your images are processed securely and never stored permanently. 
              All data is encrypted in transit and deleted after analysis.
            </AlertDescription>
          </Alert>
        </Card>
      </div>
    </div>
  );
}