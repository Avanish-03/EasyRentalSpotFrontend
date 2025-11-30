import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Brand */}
        <div>
          <h2 className="text-xl font-semibold text-white">EasyRentalSpot</h2>
          <p className="mt-3 text-sm text-gray-400 leading-relaxed">
            Helping you find verified rental homes quickly and easily.
            Your trusted partner in property rentals.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-medium text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/listings" className="hover:text-white">Listings</Link></li>
            <li><Link to="/about" className="hover:text-white">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-medium text-white mb-3">Support</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
            <li><Link to="/terms" className="hover:text-white">Terms & Conditions</Link></li>
            <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-medium text-white mb-3">Contact</h3>
          <p className="text-sm text-gray-400">📍 Gujarat, India</p>
          <p className="text-sm text-gray-400 mt-1">📧 info@easyrentalspot.com</p>
          <p className="text-sm text-gray-400 mt-1">📞 +91 9662616217</p>

          {/* Socials */}
          <div className="flex space-x-4 mt-4">
            <a href="#" className="text-gray-400 hover:text-white text-xl">
              <i className="ri-facebook-fill"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-xl">
              <i className="ri-instagram-line"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-xl">
              <i className="ri-twitter-x-line"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} EasyRentalSpot — All rights reserved.
      </div>
    </footer>
  );
}
