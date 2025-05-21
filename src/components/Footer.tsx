import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="font-['Press_Start_2P'] text-xs">
              © {new Date().getFullYear()} Questify. All rights reserved.
            </p>
          </div>
          <div className="flex items-center justify-center text-xs font-['Press_Start_2P']">
            <span>Made with</span>
            <Heart size={14} className="mx-1 text-red-500" />
            <span>by Smrithi P</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;