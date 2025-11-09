import React from 'react';
import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiMail, FiHeart } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">ScholarSync</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Share and discover academic notes to excel in your studies.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/notes" className="text-gray-600 dark:text-gray-400 hover:text-primary">Browse Notes</Link></li>
              <li><Link to="/upload" className="text-gray-600 dark:text-gray-400 hover:text-primary">Upload</Link></li>
              <li><Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-primary">About</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-primary">Contact</Link></li>
              <li><Link to="/faq" className="text-gray-600 dark:text-gray-400 hover:text-primary">FAQ</Link></li>
              <li><Link to="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-primary">Privacy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary"><FiGithub className="w-5 h-5" /></a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary"><FiTwitter className="w-5 h-5" /></a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary"><FiMail className="w-5 h-5" /></a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-600 dark:text-gray-400">
          <p className="flex items-center justify-center">
            Made with <FiHeart className="mx-1 text-red-500" /> by ScholarSync Team © 2025
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
