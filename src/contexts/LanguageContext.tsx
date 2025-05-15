
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (arabic: string, english: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage as Language) || 'ar';
  });

  // Apply document direction changes without causing unnecessary re-renders
  useEffect(() => {
    // Store in localStorage
    localStorage.setItem('language', language);

    // Update document direction and language attributes
    if (document.documentElement) {
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
    }

    // We're using document.documentElement directly to avoid causing re-renders
  }, [language]);

  const t = (arabic: string, english: string) => {
    return language === 'ar' ? arabic : english;
  };

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = React.useMemo(() => ({
    language,
    setLanguage,
    t
  }), [language]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
