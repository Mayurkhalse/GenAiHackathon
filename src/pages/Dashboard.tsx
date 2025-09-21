import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, TrendingUp, Users, Globe, Eye, Share } from 'lucide-react';
import { useArtisan } from '../contexts/ArtisanContext';
import { useLanguage } from '../contexts/LanguageContext';

const Dashboard: React.FC = () => {
  const { products } = useArtisan();
  const { currentLanguage } = useLanguage();

  const stats = [
    { label: 'Products Created', labelHi: 'उत्पाद बनाए', value: products.length, icon: TrendingUp, color: 'bg-blue-500' },
    { label: 'Languages Supported', labelHi: 'समर्थित भाषाएं', value: 6, icon: Globe, color: 'bg-green-500' },
    { label: 'AI Descriptions', labelHi: 'AI विवरण', value: products.filter(p => p.aiContent).length, icon: Eye, color: 'bg-purple-500' },
    { label: 'Social Media Ready', labelHi: 'सोशल मीडिया तैयार', value: products.filter(p => p.aiContent?.socialMedia).length, icon: Share, color: 'bg-orange-500' }
  ];

  const recentProducts = products.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 md:p-8 text-white">
        <div className="max-w-4xl">
          <h1 className="text-2xl md:text-3xl font-bold mb-3">
            {currentLanguage === 'hi' ? 'नमस्ते कारीगर!' : 'Welcome, Artisan!'}
          </h1>
          <p className="text-orange-100 text-lg mb-6">
            {currentLanguage === 'hi' 
              ? 'AI की शक्ति से अपनी कला को दुनिया तक पहुंचाएं। आधुनिक तकनीक के साथ पारंपरिक शिल्प को जोड़ें।'
              : 'Showcase your craft to the world with AI-powered descriptions and multi-language reach. Bridge traditional artistry with modern technology.'
            }
          </p>
          <Link
            to="/create"
            className="inline-flex items-center space-x-2 bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors duration-200"
          >
            <Plus className="w-5 h-5" />
            <span>{currentLanguage === 'hi' ? 'नया उत्पाद बनाएं' : 'Create New Product'}</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-600">
              {currentLanguage === 'hi' ? stat.labelHi : stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Products */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {currentLanguage === 'hi' ? 'हाल के उत्पाद' : 'Recent Products'}
            </h2>
            <Link
              to="/create"
              className="text-orange-600 hover:text-orange-700 font-medium text-sm"
            >
              {currentLanguage === 'hi' ? 'नया जोड़ें' : 'Add New'}
            </Link>
          </div>
        </div>
        
        <div className="divide-y divide-gray-100">
          {recentProducts.length > 0 ? (
            recentProducts.map((product) => (
              <Link
                key={product.id}
                to={`/content/${product.id}`}
                className="block p-6 hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center space-x-4">
                  {product.image && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{product.craftType} • {product.material}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {currentLanguage === 'hi' ? 'बनाया गया' : 'Created'}: {product.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="flex items-center space-x-2">
                      {product.aiContent && (
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      )}
                      <span className="text-sm font-medium text-gray-500">
                        {product.aiContent ? (currentLanguage === 'hi' ? 'तैयार' : 'Ready') : (currentLanguage === 'hi' ? 'प्रतीक्षा' : 'Pending')}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {currentLanguage === 'hi' ? 'अपना पहला उत्पाद बनाएं' : 'Create Your First Product'}
              </h3>
              <p className="text-gray-600 mb-4">
                {currentLanguage === 'hi' 
                  ? 'AI की मदद से अपनी कलाकृति के लिए बेहतरीन विवरण और सोशल मीडिया कंटेंट बनाएं।'
                  : 'Get started by adding your first craft and let AI generate amazing descriptions and social media content.'
                }
              </p>
              <Link
                to="/create"
                className="inline-flex items-center space-x-2 bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors duration-200"
              >
                <Plus className="w-5 h-5" />
                <span>{currentLanguage === 'hi' ? 'अभी शुरू करें' : 'Get Started'}</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;