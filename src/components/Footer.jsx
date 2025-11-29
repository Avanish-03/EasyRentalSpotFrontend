import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-8">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-600">
        <div>© {new Date().getFullYear()} EasyRentalSpot — Made with </div>
        <div className="mt-2">Built with React & Tailwind CSS</div>
      </div>
    </footer>
  );
}