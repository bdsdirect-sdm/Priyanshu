// TranslatableComponent.tsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from './TranslationContext';

interface TranslatableProps {
    children: React.ReactNode;
}

const Translatable: React.FC<TranslatableProps> = ({ children }) => {
    const { currentLanguage, translateText } = useTranslation();
    const [translatedContent, setTranslatedContent] = useState<React.ReactNode>(children);

    useEffect(() => {
        const translateContent = async () => {
            if (typeof children === 'string') {
                const translated = await translateText(children);
                setTranslatedContent(translated);
            } else if (React.isValidElement(children)) {
                // Handle nested elements
                const translateElement = async (element: React.ReactElement) => {
                    if (typeof element.props.children === 'string') {
                        const translated = await translateText(element.props.children);
                        return React.cloneElement(element, {
                            ...element.props,
                            children: translated
                        });
                    }
                    return element;
                };

                const translatedElement = await translateElement(children);
                setTranslatedContent(translatedElement);
            }
        };

        translateContent();
    }, [currentLanguage, children]);

    return <>{translatedContent}</>;
};

export default Translatable;
