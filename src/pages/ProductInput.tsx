import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Camera, Sparkles, ArrowRight } from 'lucide-react';
import { useArtisan } from '../contexts/ArtisanContext';
import { useLanguage } from '../contexts/LanguageContext';
import { generateAIContent } from '../utils/aiMockService';

const ProductInput: React.FC = () => {
  const navigate = useNavigate();
  const { addProduct, updateProduct } = useArtisan();
  const { currentLanguage } = useLanguage();
  const [isGenerating, setIsGenerating] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    material: '',
    craftType: '',
    description: '',
    image: ''
  });

  const [imagePreview, setImagePreview] = useState<string>('');

  const craftTypes = [
    { en: 'Handloom Weaving', hi: 'हस्तकरघा बुनाई' },
    { en: 'Pottery/Ceramics', hi: 'मिट्टी के बर्तन' },
    { en: 'Wood Carving', hi: 'लकड़ी की नक्काशी' },
    { en: 'Metal Craft', hi: 'धातु शिल्प' },
    { en: 'Embroidery', hi: 'कढ़ाई' },
    { en: 'Jewelry Making', hi: 'आभूषण निर्माण' },
    { en: 'Stone Carving', hi: 'पत्थर की नक्काशी' },
    { en: 'Leather Craft', hi: 'चमड़े का काम' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setFormData(prev => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDemoImage = () => {
    const demoImage = 'https://images.pexels.com/photos/8553860/pexels-photo-8553860.jpeg?auto=compress&cs=tinysrgb&w=800';
    setImagePreview(demoImage);
    setFormData(prev => ({ ...prev, image: demoImage }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.material || !formData.craftType) return;

    setIsGenerating(true);

    try {
      // Add the basic product first
      const productId = addProduct({
        name: formData.name,
        material: formData.material,
        craftType: formData.craftType,
        description: formData.description,
        image: formData.image
      });

      // Generate AI content
      const aiContent = await generateAIContent({
        name: formData.name,
        material: formData.material,
        craftType: formData.craftType,
        description: formData.description,
        image: formData.image
      });

      // Update the product with AI content
      updateProduct(productId, { aiContent });

      // Navigate to the generated content page
      navigate(`/content/${productId}`);
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900">
            {currentLanguage === 'hi' ? 'नया उत्पाद जोड़ें' : 'Add New Product'}
          </h1>
          <p className="text-gray-600 mt-2">
            {currentLanguage === 'hi' 
              ? 'अपने हस्तशिल्प की जानकारी भरें और AI से बेहतरीन विवरण बनवाएं'
              : 'Share your craft details and let AI create compelling descriptions for you'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image Upload */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              {currentLanguage === 'hi' ? 'उत्पाद की तस्वीर' : 'Product Image'}
            </label>
            
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Product preview"
                  className="w-full h-48 object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview('');
                    setFormData(prev => ({ ...prev, image: '' }));
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                <div className="text-center">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <label className="inline-flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-orange-600 transition-colors">
                      <Upload className="w-4 h-4" />
                      <span>{currentLanguage === 'hi' ? 'फोटो अपलोड करें' : 'Upload Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={handleDemoImage}
                      className="inline-flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      <span>{currentLanguage === 'hi' ? 'डेमो इमेज' : 'Use Demo'}</span>
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-3">
                    {currentLanguage === 'hi' ? 'JPG, PNG या WEBP (अधिकतम 5MB)' : 'JPG, PNG or WEBP (Max 5MB)'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Product Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              {currentLanguage === 'hi' ? 'उत्पाद का नाम *' : 'Product Name *'}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder={currentLanguage === 'hi' ? 'उदाहरण: हस्तनिर्मित बनारसी साड़ी' : 'e.g., Handwoven Banarasi Saree'}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Craft Type */}
          <div>
            <label htmlFor="craftType" className="block text-sm font-medium text-gray-700 mb-2">
              {currentLanguage === 'hi' ? 'शिल्प का प्रकार *' : 'Craft Type *'}
            </label>
            <select
              id="craftType"
              name="craftType"
              value={formData.craftType}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">
                {currentLanguage === 'hi' ? 'शिल्प का प्रकार चुनें' : 'Select craft type'}
              </option>
              {craftTypes.map((craft, index) => (
                <option key={index} value={craft.en}>
                  {currentLanguage === 'hi' ? craft.hi : craft.en}
                </option>
              ))}
            </select>
          </div>

          {/* Material */}
          <div>
            <label htmlFor="material" className="block text-sm font-medium text-gray-700 mb-2">
              {currentLanguage === 'hi' ? 'सामग्री *' : 'Material *'}
            </label>
            <input
              type="text"
              id="material"
              name="material"
              value={formData.material}
              onChange={handleInputChange}
              required
              placeholder={currentLanguage === 'hi' ? 'उदाहरण: शुद्ध रेशम, सोने की जरी' : 'e.g., Pure Silk, Gold Zari'}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              {currentLanguage === 'hi' ? 'संक्षिप्त विवरण (वैकल्पिक)' : 'Brief Description (Optional)'}
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              placeholder={currentLanguage === 'hi' 
                ? 'अपने उत्पाद के बारे में कुछ विशेष बातें बताएं...'
                : 'Tell us something special about your product...'
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isGenerating || !formData.name || !formData.material || !formData.craftType}
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-5 h-5 animate-spin" />
                  <span>
                    {currentLanguage === 'hi' ? 'AI कंटेंट बना रहा है...' : 'Generating AI Content...'}
                  </span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>
                    {currentLanguage === 'hi' ? 'AI कंटेंट बनाएं' : 'Generate AI Content'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductInput;