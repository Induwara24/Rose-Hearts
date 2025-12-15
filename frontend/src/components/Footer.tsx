import { Heart, Mail, Github, Linkedin, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-rose-50 to-pink-50 border-t border-pink-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-rose-400 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" fill="white" />
              </div>
              <span className="text-rose-600">Rose Hearts</span>
            </div>
            <p className="text-gray-600 text-sm">
              AI-powered Breast Cancer Detection System
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-gray-900">Contact</h3>
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <Mail className="w-4 h-4" />
              <a href="mailto:contact@rosehearts.ai" className="hover:text-rose-600 transition-colors">
                contact@rosehearts.ai
              </a>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-gray-900">Follow Us</h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-gray-600 hover:text-rose-600 hover:bg-rose-50 transition-colors shadow-sm"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-gray-600 hover:text-rose-600 hover:bg-rose-50 transition-colors shadow-sm"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-gray-600 hover:text-rose-600 hover:bg-rose-50 transition-colors shadow-sm"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-pink-200 text-center text-gray-600 text-sm">
          <p>&copy; {new Date().getFullYear()} Rose Hearts. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
