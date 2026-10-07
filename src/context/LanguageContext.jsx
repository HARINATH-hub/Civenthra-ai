import React, { createContext, useContext, useState } from 'react';

export const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', flag: 'EN' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', flag: 'TE' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: 'HI' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: 'TA' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', flag: 'KN' },
];

// Sample GenAI translations for complaint templates to showcase realistic multilingual outputs
export const TRANSLATION_SAMPLES = {
  pothole: {
    en: "A large pothole has been identified on the roadway at the reported location. The damaged road surface creates a severe safety hazard for two-wheelers and pedestrians. Immediate inspection and asphalt resurfacing are recommended.",
    te: "నివేదించబడిన ప్రదేశంలో రహదారిపై ఒక పెద్ద గుంత గుర్తించబడింది. దెబ్బతిన్న రోడ్డు ఉపరితలం ద్విచక్ర వాహనదారులు మరియు పాదచారులకు తీవ్రమైన ప్రమాదాన్ని కలిగిస్తుంది. వెంటనే పరిశీలన మరియు తారు మరమ్మత్తు అవసరం.",
    hi: "सूचित स्थान पर सड़क पर एक बड़ा गड्ढा पहचाना गया है। क्षतिग्रस्त सड़क की सतह दोपहिया वाहनों और पैदल चलने वालों के लिए गंभीर सुरक्षा जोखिम पैदा करती है। तत्काल निरीक्षण और डामरीकरण की सिफारिश की जाती है।",
    ta: "குறிப்பிடப்பட்ட இடத்தில் சாலையில் ஒரு பெரிய பள்ளம் கண்டறியப்பட்டுள்ளது. சேதமடைந்த சாலை மேற்பரப்பு இருசக்கர வாகன ஓட்டிகள் மற்றும் பாதசாரிகளுக்கு கடுமையான பாதுகாப்பு அபாயத்தை ஏற்படுத்துகிறது. உடனடியாக ஆய்வு செய்து தார் சாலை சீரமைப்பு மேற்கொள்ள பரிந்துரைக்கப்படுகிறது.",
    kn: "ವರದಿ ಮಾಡಲಾದ ಸ್ಥಳದಲ್ಲಿ ರಸ್ತೆಯಲ್ಲಿ ದೊಡ್ಡ ಗುಂಡಿ ಪತ್ತೆಯಾಗಿದೆ. ಹಾನಿಗೊಳಗಾದ ರಸ್ತೆ ಮೇಲ್ಮೈ ದ್ವಿಚಕ್ರ ವಾಹನ ಸವಾರರು ಮತ್ತು ಪಾದಚಾರಿಗಳಿಗೆ ಗಂಭೀರ ಸುರಕ್ಷತಾ ಅಪಾಯವನ್ನು ಉಂಟುಮಾಡುತ್ತದೆ. ತಕ್ಷಣದ ಪರಿಶೀಲನೆ ಮತ್ತು ಡಾಂಬರೀಕರಣ ದುರಸ್ತಿಗೆ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ."
  },
  streetlight: {
    en: "A non-functional municipal streetlight fixture has been detected. The lack of illumination causes severe poor visibility at night and heightens public safety concerns. Electrical division inspection and LED module replacement are required.",
    te: "పనిచేయని మున్సిపల్ వీధి దీపం గుర్తించబడింది. రాత్రి వేళల్లో వెలుతురు లేకపోవడం వల్ల తీవ్రమైన అంధకారం ఏర్పడి ప్రజా భద్రతకు ఆందోళన కలిగిస్తోంది. విద్యుత్ విభాగం తనిఖీ మరియు ఎల్‌ఈడీ ల్యాంప్ మార్పిడి అవసరం.",
    hi: "एक गैर-कार्यात्मक नगरपालिका स्ट्रीटलाइट का पता चला है। रात में रोशनी की कमी से दृश्यता कम होती है और सार्वजनिक सुरक्षा चिंताएं बढ़ती हैं। विद्युत प्रभाग द्वारा निरीक्षण और एलईडी मॉड्यूल प्रतिस्थापन की आवश्यकता है।",
    ta: "பழுதடைந்த தெருவிளக்கு கண்டறியப்பட்டுள்ளது. இரவில் வெளிச்சம் இல்லாததால் பொதுமக்களின் பாதுகாப்புக்கு அச்சுறுத்தல் ஏற்படுகிறது. மின்வாரிய ஆய்வு மற்றும் எல்இடி பொருத்துதல் தேவைப்படுகிறது.",
    kn: "ಕೆಲಸ ಮಾಡದ ಪುರಸಭೆಯ ಬೀದಿ ದೀಪ ಪತ್ತೆಯಾಗಿದೆ. ರಾತ್ರಿಯಲ್ಲಿ ಬೆಳಕಿನ ಕೊರತೆಯು ಸಾರ್ವಜನಿಕ ಸುರಕ್ಷತೆಗೆ ಅಪಾಯವನ್ನುಂಟುಮಾಡುತ್ತದೆ. ವಿದ್ಯುತ್ ವಿಭಾಗದ ಪರಿಶೀಲನೆ ಮತ್ತು ಎಲ್ಇಡಿ ಬದಲಿ ಅಗತ್ಯವಿದೆ."
  },
  garbage: {
    en: "An illegal or overflowing solid waste accumulation has been detected on the public roadside. The uncollected garbage presents sanitation risks, foul odor, and potential health hazards. Immediate deployment of municipal waste removal truck is requested.",
    te: "ప్రజా రహదారి పక్కన చెత్తకుప్పలు పేరుకుపోయినట్లు గుర్తించబడింది. ఈ చెత్త వల్ల దుర్వాసన, పారిశుద్ధ్య సమస్యలు మరియు ప్రజారోగ్యానికి ప్రమాదం పొంచివుంది. మున్సిపల్ చెత్త సేకరణ వాహనాన్ని వెంటనే పంపాల్సిందిగా కోరుతున్నాము.",
    hi: "सार्वजनिक सड़क किनारे कचरे का अत्यधिक जमाव पाया गया है। बिना उठाए गए कचरे से दुर्गंध और स्वास्थ्य जोखिम उत्पन्न हो रहा है। नगर निगम के कचरा संग्रहण वाहन को तत्काल भेजने का अनुरोध है।",
    ta: "பொது சாலையோரத்தில் குப்பைகள் தேங்கியுள்ளது கண்டறியப்பட்டுள்ளது. இது சுகாதார சீர்கேட்டையும் துர்நாற்றத்தையும் ஏற்படுத்துகிறது. உடனடியாக நகராட்சி குப்பை அகற்றும் வாகனத்தை அனுப்பக் கோரப்படுகிறது.",
    kn: "ಸಾರ್ವಜನಿಕ ರಸ್ತೆ ಬದಿಯಲ್ಲಿ ಕಸದ ರಾಶಿ ಸಂಗ್ರಹವಾಗಿರುವುದು ಪತ್ತೆಯಾಗಿದೆ. ಇದು ನೈರ್ಮಲ್ಯ ಸಮಸ್ಯೆ ಮತ್ತು ದುರ್ವಾಸನೆಯನ್ನು ಉಂಟುಮಾಡುತ್ತದೆ. ಪುರಸಭೆಯ ತ್ಯಾಜ್ಯ ವಿಲೇವಾರಿ ವಾಹನವನ್ನು ತಕ್ಷಣ ಕಳುಹಿಸಲು ಕೋರಲಾಗಿದೆ."
  },
  drainage: {
    en: "A blocked drainage conduit and stormwater overflow have been identified. Stagnant runoff water poses vector-borne disease risks and disrupts road traffic. Stormwater Drainage department clearance and desilting are urged.",
    te: "మూసుకుపోయిన మురుగు కాలువ మరియు వర్షపు నీటి ప్రవాహం గుర్తించబడింది. నిలిచిన నీరు దోమల వ్యాధులకు కారణమవుతుంది మరియు ట్రాఫిక్‌కు అంతరాయం కలిగిస్తుంది. డ్రైనేజీ విభాగం తక్షణమే పూడికతీత పనులు చేపట్టాలి.",
    hi: "अवरुद्ध जल निकासी और बारिश के पानी का जमाव पाया गया है। जमा हुआ पानी बीमारियों का खतरा बढ़ाता है और यातायात को बाधित करता है। जल निकासी विभाग द्वारा तत्काल सफाई की आवश्यकता है।",
    ta: "அடைபட்ட கழிவுநீர் கால்வாய் கண்டறியப்பட்டுள்ளது. தேங்கி நிற்கும் நீரால் கொசுக்கள் உற்பத்தியாகி நோய் பரவும் அபாயம் உள்ளது. உடனடியாக தூர்வாரப்பட வேண்டும்.",
    kn: "ಮುಚ್ಚಿಹೋದ ಒಳಚರಂಡಿ ಮತ್ತು ಮಳೆನೀರು ತುಂಬಿ ಹರಿಯುವುದು ಪತ್ತೆಯಾಗಿದೆ. ನಿಂತ ನೀರು ರೋಗಗಳ ಅಪಾಯವನ್ನುಂಟುಮಾಡುತ್ತದೆ. ಒಳಚರಂಡಿ ವಿಭಾಗವು ತಕ್ಷಣ ಹೂಳೆತ್ತುವಂತೆ ಕೋರಲಾಗಿದೆ."
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('civenthra_lang') || 'en';
  });

  const setLanguage = (langCode) => {
    setCurrentLanguage(langCode);
    localStorage.setItem('civenthra_lang', langCode);
  };

  const getTranslatedComplaint = (issueType, lang = currentLanguage) => {
    const key = issueType?.toLowerCase() || 'pothole';
    const samples = TRANSLATION_SAMPLES[key] || TRANSLATION_SAMPLES['pothole'];
    return samples[lang] || samples['en'];
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        languages: LANGUAGES,
        getTranslatedComplaint
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
