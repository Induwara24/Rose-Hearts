import { AlertCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { ImageWithFallback } from "../figma/ImageWithFallback";

export function Error() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-peach-50 flex items-center justify-center py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="p-8 md:p-12 bg-white border-pink-100 shadow-lg text-center">
          <div className="mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-12 h-12 text-rose-600" />
            </div>
            
            <h1 className="text-gray-900 mb-4">
              Oops! Something Went Wrong
            </h1>
            
            <p className="text-gray-600 mb-2">
              We encountered an error while processing your request.
            </p>
            <p className="text-gray-600">
              This could be due to:
            </p>
          </div>

          <div className="mb-8 bg-rose-50 border border-rose-200 rounded-lg p-6 text-left">
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-rose-600 mt-1">•</span>
                <span>Invalid file format (please use .jpg or .png)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-600 mt-1">•</span>
                <span>File size too large (maximum 10MB)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-600 mt-1">•</span>
                <span>Network connection issues</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-600 mt-1">•</span>
                <span>Temporary server unavailability</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <Link to="/upload">
              <Button 
                size="lg" 
                className="w-full md:w-auto bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-lg shadow-pink-200"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Return to Upload Page
              </Button>
            </Link>
            
            <p className="text-gray-600 text-sm">
              If the problem persists, please contact our support team at{" "}
              <a href="mailto:support@rosehearts.ai" className="text-rose-600 hover:underline">
                support@rosehearts.ai
              </a>
            </p>
          </div>

          {/* Illustration */}
          <div className="mt-8 rounded-xl overflow-hidden opacity-50">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1580378156095-317d986123f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwaWxsdXN0cmF0aW9uJTIwYWJzdHJhY3R8ZW58MXx8fHwxNzYyNjQzMzIzfDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Medical illustration"
              className="w-full h-48 object-cover"
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
