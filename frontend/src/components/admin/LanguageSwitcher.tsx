// LanguageSwitcher.tsx
import React from 'react';
import { useTranslation } from './TranslationContext';

const LanguageSwitcher: React.FC = () => {
    const { changeLanguage } = useTranslation();

    const languages = [
        { code: 'en', name: 'English' },
        { code: 'es', name: 'Spanish' },
        { code: 'fr', name: 'French' },
        { code: 'de', name: 'German' }
    ];

    return (
        <div>
            {languages.map((lang) => (
                <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                >
                    {lang.name}
                </button>
            ))}
        </div>
    );
};

export default LanguageSwitcher;
