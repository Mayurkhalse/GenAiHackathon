// Mock AI service to simulate Google Cloud Vertex AI responses
// In production, this would connect to actual Google Cloud services

interface ProductInput {
  name: string;
  material: string;
  craftType: string;
  description: string;
  image?: string;
}

interface AIContent {
  description: { [language: string]: string };
  socialMedia: { [language: string]: string };
  hashtags: { [language: string]: string[] };
}

const craftDescriptions: { [key: string]: { [language: string]: string } } = {
  'Handloom Weaving': {
    en: 'traditional handwoven textiles that showcase centuries-old weaving techniques passed down through generations',
    hi: 'पारंपरिक हस्तनिर्मित वस्त्र जो पीढ़ियों से चली आ रही बुनाई की तकनीकों को दर्शाते हैं',
    mr: 'पारंपरिक हस्तनिर्मित वस्त्र जे पिढ्यानपिढ्या चाललेल्या विणकाम तंत्रज्ञानाचे प्रतिबिंब आहेत',
    ta: 'தலைமுறை தலைமுறையாக கடத்தப்பட்ட நெசவு நுட்பங்களை வெளிப்படுத்தும் பாரம்பரிய கைத்தறி',
    te: 'తరాలుగా అందించబడిన నేత పద్ధతులను ప్రదర్శించే సాంప్రదాయ చేతిమగ్గం',
    bn: 'প্রজন্মের পর প্রজন্ম ধরে চলে আসা তাঁত শিল্পের ঐতিহ্যবাহী কৌশল'
  }
};

const socialMediaTemplates: { [language: string]: string } = {
  en: '✨ Discover the magic of authentic Indian craftsmanship! This beautiful {productName} is a testament to our rich cultural heritage. Each piece is lovingly crafted by skilled artisans using traditional techniques passed down through generations. Support local artisans and own a piece of history! 🇮🇳',
  hi: '✨ भारतीय शिल्पकारी का जादू खोजें! यह सुंदर {productName} हमारी समृद्ध सांस्कृतिक विरासत का प्रमाण है। प्रत्येक टुकड़ा कुशल कारीगरों द्वारा पारंपरिक तकनीकों का उपयोग करके प्रेम से तैयार किया गया है। स्थानीय कारीगरों का समर्थन करें! 🇮🇳',
  mr: '✨ भारतीय कलाकुसरीचा जादू शोधा! हे सुंदर {productName} आपल्या समृद्ध सांस्कृतिक वारशाचा पुरावा आहे। प्रत्येक तुकडा कुशल कारागिरांनी पारंपरिक तंत्र वापरून प्रेमाने तयार केला आहे। स्थानिक कारागिरांना पाठिंबा द्या! 🇮🇳',
  ta: '✨ உண்மையான இந்திய கைவினைத்திறனின் மாயத்தைக் கண்டறியுங்கள்! இந்த அழகான {productName} நமது வளமான கலாச்சார பாரம்பரியத்தின் சாட்சி. ஒவ்வொரு துண்டும் திறமையான கைவினைஞர்களால் பாரம்பரிய நுட்பங்களைப் பயன்படுத்தி அன்புடன் வடிவமைக்கப்பட்டுள்ளது। 🇮🇳',
  te: '✨ ప్రామాణిక భారతీయ చేతిపని మేజిక్‌ను కనుగొనండి! ఈ అందమైన {productName} మన గొప్ప సాంస్కృతిక వారసత్వానికి నిదర్శనం. ప్రతి ముక్క నైపుణ్యం కలిగిన కళాకారులచే సాంప్రదాయ పద్ధతులను ఉపయోగించి ప్రేమతో తయారు చేయబడింది। 🇮🇳',
  bn: '✨ খাঁটি ভারতীয় কারুশিল্পের জাদু আবিষ্কার করুন! এই সুন্দর {productName} আমাদের সমৃদ্ধ সাংস্কৃতিক ঐতিহ্যের সাক্ষ্য। প্রতিটি অংশ দক্ষ কারিগরদের দ্বারা ঐতিহ্যবাহী কৌশল ব্যবহার করে ভালোবাসার সাথে তৈরি করা হয়েছে। 🇮🇳'
};

const hashtagsByLanguage: { [language: string]: string[] } = {
  en: ['HandmadeInIndia', 'IndianCrafts', 'ArtisanMade', 'TraditionalCraft', 'MadeInIndia', 'IndianHeritage', 'SupportArtisans'],
  hi: ['हस्तनिर्मितभारत', 'भारतीयशिल्प', 'कारीगरनिर्मित', 'पारंपरिकशिल्प', 'मेडइनइंडिया', 'भारतीयविरासत'],
  mr: ['हस्तनिर्मितभारत', 'भारतीयकला', 'कारागिरनिर्मित', 'पारंपरिककला', 'मेडइनइंडिया', 'भारतीयवारसा'],
  ta: ['கைவினைபொருள்கள்', 'இந்தியகைவினை', 'பாரம்பரியகலை', 'மேடஇன்இந்தியா', 'இந்தியபாரம்பரியம்'],
  te: ['చేతిపనులు', 'భారతీయకళలు', 'సాంప్రదాయకళ', 'మేడఇన్ఇండియా', 'భారతీయవారసత్వం'],
  bn: ['হস্তশিল্প', 'ভারতীয়শিল্প', 'ঐতিহ্যবাহীশিল্প', 'মেডইনইন্ডিয়া', 'ভারতীয়ঐতিহ্য']
};

export const generateAIContent = async (productInput: ProductInput): Promise<AIContent> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  const { name, material, craftType, description } = productInput;

  // Generate description for each language
  const descriptions: { [language: string]: string } = {};
  const socialMediaPosts: { [language: string]: string } = {};
  const hashtags: { [language: string]: string[] } = {};

  const languages = ['en', 'hi', 'mr', 'ta', 'te', 'bn'];

  for (const lang of languages) {
    // Generate product description
    const craftDesc = craftDescriptions[craftType]?.[lang] || craftDescriptions['Handloom Weaving'][lang];
    
    descriptions[lang] = lang === 'en' 
      ? `Exquisite ${name.toLowerCase()} crafted with ${material.toLowerCase()}. This masterpiece showcases ${craftDesc}, featuring ${description || 'intricate traditional patterns that tell stories of Indian heritage'}. Perfect for special occasions and a wonderful addition to any collection celebrating authentic Indian craftsmanship.`
      : lang === 'hi'
      ? `${material} से बना यह उत्कृष्ट ${name}। यह कृति ${craftDesc} को दर्शाती है। ${description || 'जटिल पारंपरिक पैटर्न के साथ जो भारतीय विरासत की कहानी कहते हैं'}। विशेष अवसरों के लिए एकदम सही।`
      : socialMediaTemplates[lang].replace('{productName}', name);

    // Generate social media content
    socialMediaPosts[lang] = socialMediaTemplates[lang].replace('{productName}', name);

    // Add relevant hashtags
    hashtags[lang] = [
      ...hashtagsByLanguage[lang],
      ...getCraftSpecificHashtags(craftType, lang)
    ];
  }

  return {
    description: descriptions,
    socialMedia: socialMediaPosts,
    hashtags: hashtags
  };
};

const getCraftSpecificHashtags = (craftType: string, language: string): string[] => {
  const craftHashtags: { [key: string]: { [language: string]: string[] } } = {
    'Handloom Weaving': {
      en: ['HandloomWeaving', 'WeavingArt', 'TraditionalTextiles', 'HandwovenFabric'],
      hi: ['हथकरघा', 'बुनाईकला', 'पारंपरिकवस्त्र', 'हस्तबुना'],
      mr: ['हातमाग', 'विणकाम', 'पारंपरिकवस्त्र', 'हस्तविणीत'],
      ta: ['கைத்தறி', 'நெசவுகலை', 'பாரம்பரியவस்त্र', 'கைநெய்த'],
      te: ['చేతిమగ్గం', 'నేతకళ', 'సాంప్రదాయవస్త్రాలు', 'చేతినేత'],
      bn: ['হাতেবোনা', 'তাঁতশিল্প', 'ঐতিহ্যবাহীবস্ত্র', 'হস্তনির্মিত']
    },
    'Pottery/Ceramics': {
      en: ['Pottery', 'Ceramics', 'ClayArt', 'Terracotta'],
      hi: ['मिट्टी', 'कुम्हारी', 'मृण्कला', 'टेराकोटा'],
      mr: ['मातीकाम', 'कुंभारकला', 'मृद्कला', 'टेराकोटा'],
      ta: ['மண்பாண்டம்', 'களிமண்कलை', 'மிट்டிकெलै', 'டेरাकோட्टा'],
      te: ['కుండలు', 'మట్టికళ', 'మృత్కళ', 'టెరాకోట'],
      bn: ['মৃৎশিল্প', 'মাটিরকাজ', 'কুমোরশিল্প', 'টেরাকোটা']
    }
    // Add more craft types as needed
  };

  return craftHashtags[craftType]?.[language] || [];
};