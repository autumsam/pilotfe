
import { Facebook, Twitter, Instagram, Linkedin, Github, Mail, ArrowUpRight } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-postpulse-darkBlue text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-postpulse-blue flex items-center justify-center text-white font-bold">
                P
              </div>
              <h2 className="text-2xl font-bold">
                Post<span className="font-normal">Pulse</span>
              </h2>
            </div>
            <p className="text-gray-300 mb-4">
              Post smarter, not harder. Create once, optimize with AI, and track success—all in one place.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-postpulse-orange transition-colors p-2 bg-white/10 rounded-full">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-white hover:text-postpulse-orange transition-colors p-2 bg-white/10 rounded-full">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-white hover:text-postpulse-orange transition-colors p-2 bg-white/10 rounded-full">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-white hover:text-postpulse-orange transition-colors p-2 bg-white/10 rounded-full">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center">
              Product
              <ArrowUpRight className="ml-1 w-4 h-4 opacity-70" />
            </h3>
            <ul className="space-y-2">
              <li><a href="#features" className="text-gray-300 hover:text-postpulse-orange transition-colors inline-block py-1">Features</a></li>
              <li><a href="#pricing" className="text-gray-300 hover:text-postpulse-orange transition-colors inline-block py-1">Pricing</a></li>
              <li><a href="#" className="text-gray-300 hover:text-postpulse-orange transition-colors inline-block py-1">API</a></li>
              <li><a href="#" className="text-gray-300 hover:text-postpulse-orange transition-colors inline-block py-1">Integrations</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center">
              Resources
              <ArrowUpRight className="ml-1 w-4 h-4 opacity-70" />
            </h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-postpulse-orange transition-colors inline-block py-1">Blog</a></li>
              <li><a href="#" className="text-gray-300 hover:text-postpulse-orange transition-colors inline-block py-1">Help Center</a></li>
              <li><a href="#" className="text-gray-300 hover:text-postpulse-orange transition-colors inline-block py-1">Guides</a></li>
              <li><a href="#" className="text-gray-300 hover:text-postpulse-orange transition-colors inline-block py-1">Webinars</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center">
              Company
              <ArrowUpRight className="ml-1 w-4 h-4 opacity-70" />
            </h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-postpulse-orange transition-colors inline-block py-1">About</a></li>
              <li><a href="#" className="text-gray-300 hover:text-postpulse-orange transition-colors inline-block py-1">Careers</a></li>
              <li><a href="#" className="text-gray-300 hover:text-postpulse-orange transition-colors inline-block py-1">Contact</a></li>
              <li>
                <a href="mailto:hello@postpulse.com" className="text-gray-300 hover:text-postpulse-orange transition-colors inline-flex items-center py-1">
                  <Mail className="mr-2 h-4 w-4" />
                  hello@postpulse.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} PostPulse. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-postpulse-orange transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-postpulse-orange transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-postpulse-orange transition-colors">Cookies</a>
            <a href="https://github.com" className="text-gray-400 hover:text-postpulse-orange transition-colors flex items-center">
              <Github size={14} className="mr-1" /> GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
