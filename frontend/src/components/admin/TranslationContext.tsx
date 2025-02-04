// TranslationContext.tsx
import React, {
    createContext,
    useState,
    useContext,
    useEffect
} from 'react';
import { translationService } from '../../utils/translationService';

interface TranslationContextType {
    currentLanguage: string;
    changeLanguage: (lang: string) => void;
    translateText: (text: string) => Promise<string>;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentLanguage, setCurrentLanguage] = useState<string>('en');

    const changeLanguage = (lang: string) => {
        setCurrentLanguage(lang);
    };

    const translateText = async (text: string) => {
        return await translationService.translateText(text, currentLanguage);
    };

    return (
        <TranslationContext.Provider
            value={{
                currentLanguage,
                changeLanguage,
                translateText
            }}
        >
            {children}
        </TranslationContext.Provider>
    );
};

// Custom hook for using translation
export const useTranslation = () => {
    const context = useContext(TranslationContext);
    if (!context) {
        throw new Error('useTranslation must be used within a TranslationProvider');
    }
    return context;
};
