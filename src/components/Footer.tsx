import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="font-bold text-lg mb-2">MedSynth AI</div>
            <p className="text-gray-400 text-sm">
              Advancing medical image analysis through synthetic data generation
            </p>
          </div>
          <div className="flex space-x-6">
            <Link to="/" className="text-gray-300 hover:text-white text-sm">
              About
            </Link>
            <Link to="/" className="text-gray-300 hover:text-white text-sm">
              Research
            </Link>
            <Link
              to="/instagram"
              className="text-gray-300 hover:text-white text-sm"
            >
              Contact
            </Link>
            <Link
              to="/login"
              className="text-gray-300 hover:text-white text-sm"
            >
              Login
            </Link>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} MedSynth AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
