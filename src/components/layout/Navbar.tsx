
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleTryFree = () => {
    navigate("/login");
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white dark:bg-gray-900 shadow-md py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <a href="/" className="flex items-center gap-2 z-20 relative">
          <div className="w-8 h-8 rounded-full bg-postpulse-blue flex items-center justify-center text-white font-bold">
            P
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-postpulse-blue dark:text-postpulse-blue">
            Post<span className="font-normal text-postpulse-darkBlue dark:text-blue-300">Pulse</span>
          </h1>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
          <a href="/#features" className="text-gray-700 dark:text-gray-300 hover:text-postpulse-blue dark:hover:text-blue-400 font-medium transition-colors">
            Features
          </a>
          <a href="/#how-it-works" className="text-gray-700 dark:text-gray-300 hover:text-postpulse-blue dark:hover:text-blue-400 font-medium transition-colors">
            How It Works
          </a>
          <a href="/about" className="text-gray-700 dark:text-gray-300 hover:text-postpulse-blue dark:hover:text-blue-400 font-medium transition-colors">
            About
          </a>
          <a href="/contact" className="text-gray-700 dark:text-gray-300 hover:text-postpulse-blue dark:hover:text-blue-400 font-medium transition-colors">
            Contact
          </a>
          <a href="/#pricing" className="text-gray-700 dark:text-gray-300 hover:text-postpulse-blue dark:hover:text-blue-400 font-medium transition-colors">
            Pricing
          </a>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button 
            variant="ghost" 
            className="text-gray-700 dark:text-gray-300 hover:text-postpulse-blue dark:hover:text-blue-400"
            onClick={handleLogin}
          >
            Login
          </Button>
          <Button 
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow hover:shadow-md transition-all rounded-full"
            onClick={handleTryFree}
          >
            Try for Free
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 dark:text-gray-300 z-20 relative"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white dark:bg-gray-900 z-10 pt-20 animate-fade-in overflow-auto">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <a
              href="/#features"
              className="text-gray-700 dark:text-gray-300 hover:text-postpulse-blue font-medium transition-colors p-3 text-base border-b border-gray-100 dark:border-gray-800"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="/#how-it-works"
              className="text-gray-700 dark:text-gray-300 hover:text-postpulse-blue font-medium transition-colors p-3 text-base border-b border-gray-100 dark:border-gray-800"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              How It Works
            </a>
            <a
              href="/about"
              className="text-gray-700 dark:text-gray-300 hover:text-postpulse-blue font-medium transition-colors p-3 text-base border-b border-gray-100 dark:border-gray-800"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </a>
            <a
              href="/contact"
              className="text-gray-700 dark:text-gray-300 hover:text-postpulse-blue font-medium transition-colors p-3 text-base border-b border-gray-100 dark:border-gray-800"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </a>
            <a
              href="/#pricing"
              className="text-gray-700 dark:text-gray-300 hover:text-postpulse-blue font-medium transition-colors p-3 text-base border-b border-gray-100 dark:border-gray-800"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </a>
            <div className="flex flex-col gap-3 pt-4">
              <Button 
                variant="ghost" 
                className="justify-center w-full text-base py-5"
                onClick={() => {
                  handleLogin();
                  setIsMobileMenuOpen(false);
                }}
              >
                Login
              </Button>
              <Button 
                className="bg-primary hover:bg-primary/90 text-primary-foreground justify-center w-full text-base py-5 rounded-full"
                onClick={() => {
                  handleTryFree();
                  setIsMobileMenuOpen(false);
                }}
              >
                Try for Free
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
