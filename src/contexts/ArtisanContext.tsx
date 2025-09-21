import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Product {
  id: string;
  name: string;
  material: string;
  craftType: string;
  description: string;
  image?: string;
  createdAt: Date;
  aiContent?: {
    description: { [language: string]: string };
    socialMedia: { [language: string]: string };
    hashtags: { [language: string]: string[] };
  };
}

interface ArtisanContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => string;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  getProduct: (id: string) => Product | undefined;
}

const ArtisanContext = createContext<ArtisanContextType | undefined>(undefined);

export const useArtisan = () => {
  const context = useContext(ArtisanContext);
  if (!context) {
    throw new Error('useArtisan must be used within an ArtisanProvider');
  }
  return context;
};

interface ArtisanProviderProps {
  children: ReactNode;
}

export const ArtisanProvider: React.FC<ArtisanProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 'demo-1',
      name: 'Handwoven Banarasi Saree',
      material: 'Pure Silk with Gold Zari',
      craftType: 'Handloom Weaving',
      description: 'Traditional handwoven saree with intricate gold patterns',
      image: 'https://images.pexels.com/photos/8553860/pexels-photo-8553860.jpeg?auto=compress&cs=tinysrgb&w=800',
      createdAt: new Date('2024-01-15'),
      aiContent: {
        description: {
          en: 'Exquisite handwoven Banarasi saree crafted with pure silk and adorned with intricate gold zari work. This masterpiece showcases centuries-old weaving traditions, featuring timeless patterns that tell stories of Indian heritage. Perfect for weddings and special occasions.',
          hi: 'शुद्ध रेशम से बना और जटिल सोने की जरी के काम से सजा यह उत्कृष्ट हस्तनिर्मित बनारसी साड़ी। यह कृति सदियों पुरानी बुनाई की परंपराओं को दर्शाती है।',
          mr: 'शुद्ध रेशमापासून बनवलेली आणि सुवर्ण जरीच्या काळजीपूर्वक केलेल्या कामाने सजवलेली ही उत्कृष्ट हस्तनिर्मित बनारसी साडी।'
        },
        socialMedia: {
          en: '✨ Discover the magic of traditional craftsmanship! This stunning Banarasi saree represents hours of skilled artisan work. Support local artisans and own a piece of Indian heritage. 🇮🇳 #HandmadeInIndia #BanarasiSaree #TraditionalCraft',
          hi: '✨ पारंपरिक शिल्पकला का जादू खोजें! यह आश्चर्यजनक बनारसी साड़ी कुशल कारीगरों के घंटों के काम को दर्शाती है। #हस्तनिर्मितभारत #बनारसीसाड़ी',
          mr: '✨ पारंपरिक कलाकुसरीचा जादू शोधा! ही सुंदर बनारसी साडी तज्ञ कारागिरांच्या तासांच्या कामाचे प्रतिनिधित्व करते। #हस्तनिर्मितभारत'
        },
        hashtags: {
          en: ['#HandmadeInIndia', '#BanarasiSaree', '#TraditionalCraft', '#SilkSaree', '#IndianHeritage', '#ArtisanMade', '#HandloomWeaving'],
          hi: ['#हस्तनिर्मितभारत', '#बनारसीसाड़ी', '#पारंपरिकशिल्प', '#रेशमीसाड़ी', '#भारतीयविरासत'],
          mr: ['#हस्तनिर्मितभारत', '#बनारसीसाडी', '#पारंपरिककला', '#रेशमीसाडी', '#भारतीयवारसा']
        }
      }
    }
  ]);

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>): string => {
    const id = 'product-' + Date.now();
    const newProduct: Product = {
      ...productData,
      id,
      createdAt: new Date()
    };
    setProducts(prev => [newProduct, ...prev]);
    return id;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(product => 
      product.id === id ? { ...product, ...updates } : product
    ));
  };

  const getProduct = (id: string): Product | undefined => {
    return products.find(product => product.id === id);
  };

  const value: ArtisanContextType = {
    products,
    addProduct,
    updateProduct,
    getProduct
  };

  return (
    <ArtisanContext.Provider value={value}>
      {children}
    </ArtisanContext.Provider>
  );
};