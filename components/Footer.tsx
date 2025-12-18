"use client";

import Link from "next/link";
import { FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-800 py-8 mt-0">
      <div className="container mx-auto px-4 sm:px-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <Link href="/">
              <h3 className="text-2xl font-bold text-pink-600 mb-4">atiraura</h3>
            </Link>
            <p className="text-sm">
            Sifatli atirlar uchun yagona manzilingiz. Uzbekistondagi eng yaxshi hidlarni kashf eting!
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm hover:text-pink-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-sm hover:text-pink-600 transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:text-pink-600 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Contact Us</h4>
            <p className="text-sm">Email: support@atiraura.uz</p>
            <p className="text-sm">Phone: +998 91 224 79 40</p>
          </div>

          {/* Social Media Links */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com/atiraura"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-pink-600 transition-colors"
              >
                <FaInstagram size={24} />
              </a>
              <a
                href="https://facebook.com/atiraura"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-pink-600 transition-colors"
              >
                <FaFacebook size={24} />
              </a>
              <a
                href="https://twitter.com/atiraura"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-pink-600 transition-colors"
              >
                <FaTwitter size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-8 pt-4 border-t border-gray-300 text-center">
          <p className="text-sm text-gray-600">
            © 2025 atiraura. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}