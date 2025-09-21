import React, { ReactNode } from 'react';
import Navigation from './Navigation';
import LanguageSelector from './LanguageSelector';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b-2 border-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">शि</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ShilpKaar</h1>
                <p className="text-sm text-gray-600 hidden sm:block">AI Assistant for Artisans</p>
              </div>
            </div>
            <LanguageSelector />
          </div>
        </div>
      </header>

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sm opacity-80">
              Empowering Indian Artisans with AI • शिल्पकार - भारतीय कारीगरों के लिए AI सहायक
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;