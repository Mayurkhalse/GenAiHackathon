import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Copy, Share2, Globe, Hash, Eye, CheckCircle } from 'lucide-react';
import { useArtisan } from '../contexts/ArtisanContext';
import { useLanguage } from '../contexts/LanguageContext';

const GeneratedContent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getProduct } = useArtisan();
  const { currentLanguage, languages } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);
  const [copiedText, setCopiedText] = useState<string>('');

  const product = id ? getProduct(id) : undefined;

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
        <Link to="/" className="text-orange-600 hover:text-orange-700">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const aiContent = product.aiContent;

  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(type);
      setTimeout(() => setCopiedText(''), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleShare = (text: string, type: string) => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: text,
      });
    } else {
      handleCopy(text, type);
    }
  };

  const getContentInLanguage = (content: { [key: string]: string } | undefined, fallback: string = '') => {
    if (!content) return fallback;
    return content[selectedLanguage] || content['en'] || fallback;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{currentLanguage === 'hi' ? 'वापस' : 'Back'}</span>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-gray-600">{product.craftType} • {product.material}</p>
        </div>
      </div>

      {/* Language Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center space-x-4 flex-wrap">
          <Globe className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-700">
            {currentLanguage === 'hi' ? 'भाषा चुनें:' : 'Select Language:'}
          </span>
          <div className="flex flex-wrap gap-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setSelectedLanguage(lang.code)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedLanguage === lang.code
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {lang.nativeName}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Product Preview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {currentLanguage === 'hi' ? 'उत्पाद पूर्वावलोकन' : 'Product Preview'}
          </h2>
          {product.image && (
            <div className="mb-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg border border-gray-200"
              />
            </div>
          )}
          <div className="space-y-3">
            <div>
              <span className="font-medium text-gray-700">
                {currentLanguage === 'hi' ? 'नाम:' : 'Name:'}
              </span>
              <p className="text-gray-900">{product.name}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">
                {currentLanguage === 'hi' ? 'शिल्प:' : 'Craft:'}
              </span>
              <p className="text-gray-900">{product.craftType}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">
                {currentLanguage === 'hi' ? 'सामग्री:' : 'Material:'}
              </span>
              <p className="text-gray-900">{product.material}</p>
            </div>
          </div>
        </div>

        {/* AI Generated Description */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {currentLanguage === 'hi' ? 'AI उत्पाद विवरण' : 'AI Product Description'}
              </h2>
              <Eye className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div className="p-6">
            {aiContent?.description ? (
              <div className="space-y-4">
                <p className="text-gray-800 leading-relaxed">
                  {getContentInLanguage(aiContent.description, 'AI description will be generated...')}
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleCopy(getContentInLanguage(aiContent.description), 'description')}
                    className="inline-flex items-center space-x-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    {copiedText === 'description' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedText === 'description' ? (currentLanguage === 'hi' ? 'कॉपी हो गया' : 'Copied') : (currentLanguage === 'hi' ? 'कॉपी करें' : 'Copy')}</span>
                  </button>
                  <button
                    onClick={() => handleShare(getContentInLanguage(aiContent.description), 'description')}
                    className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>{currentLanguage === 'hi' ? 'शेयर करें' : 'Share'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>{currentLanguage === 'hi' ? 'AI विवरण तैयार हो रहा है...' : 'AI description is being generated...'}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Social Media Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            {currentLanguage === 'hi' ? 'सोशल मीडिया कंटेंट' : 'Social Media Content'}
          </h2>
        </div>
        <div className="p-6">
          {aiContent?.socialMedia ? (
            <div className="space-y-6">
              {/* Social Media Post */}
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4 border border-pink-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">
                    {currentLanguage === 'hi' ? 'इंस्टाग्राम/फेसबुक पोस्ट' : 'Instagram/Facebook Post'}
                  </h3>
                </div>
                <p className="text-gray-800 mb-4 leading-relaxed">
                  {getContentInLanguage(aiContent.socialMedia)}
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleCopy(getContentInLanguage(aiContent.socialMedia), 'social')}
                    className="inline-flex items-center space-x-2 bg-pink-100 text-pink-700 px-3 py-2 rounded-lg hover:bg-pink-200 transition-colors text-sm"
                  >
                    {copiedText === 'social' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedText === 'social' ? (currentLanguage === 'hi' ? 'कॉपी हो गया' : 'Copied') : (currentLanguage === 'hi' ? 'कॉपी करें' : 'Copy')}</span>
                  </button>
                  <button
                    onClick={() => handleShare(getContentInLanguage(aiContent.socialMedia), 'social')}
                    className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>{currentLanguage === 'hi' ? 'शेयर करें' : 'Share'}</span>
                  </button>
                </div>
              </div>

              {/* Hashtags */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                    <Hash className="w-4 h-4" />
                    <span>{currentLanguage === 'hi' ? 'हैशटैग' : 'Hashtags'}</span>
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {(aiContent.hashtags?.[selectedLanguage] || aiContent.hashtags?.['en'] || []).map((hashtag, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      #{hashtag}
                    </span>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      const hashtags = (aiContent.hashtags?.[selectedLanguage] || aiContent.hashtags?.['en'] || [])
                        .map(tag => `#${tag}`).join(' ');
                      handleCopy(hashtags, 'hashtags');
                    }}
                    className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                  >
                    {copiedText === 'hashtags' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedText === 'hashtags' ? (currentLanguage === 'hi' ? 'कॉपी हो गया' : 'Copied') : (currentLanguage === 'hi' ? 'कॉपी करें' : 'Copy')}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>{currentLanguage === 'hi' ? 'सोशल मीडिया कंटेंट तैयार हो रहा है...' : 'Social media content is being generated...'}</p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
        <Link
          to="/create"
          className="inline-flex items-center justify-center space-x-2 bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
        >
          <span>{currentLanguage === 'hi' ? 'नया उत्पाद बनाएं' : 'Create New Product'}</span>
        </Link>
        <Link
          to="/"
          className="inline-flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
        >
          <span>{currentLanguage === 'hi' ? 'डैशबोर्ड पर जाएं' : 'Go to Dashboard'}</span>
        </Link>
      </div>
    </div>
  );
};

export default GeneratedContent;