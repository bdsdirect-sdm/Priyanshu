// // translationService.ts
// import axios from 'axios';

// class TranslationService {
//     private apiKey: string = 'AIzaSyClRzDqDh5MsXwnCWi0kOiiBivP6JsSyBw'; // Replace with your actual API key
//     private baseUrl: string = 'https://translation.googleapis.com/language/translate/v2';

//     async translateText(text: string, targetLanguage: string): Promise<string> {
//         try {
//             const response = await axios.post(
//                 `${this.baseUrl}?key=${this.apiKey}`,
//                 {
//                     q: text,
//                     target: targetLanguage
//                 }
//             );

//             return response.data.data.translations[0].translatedText;
//         } catch (error) {
//             console.error('Translation error:', error);
//             return text; // Fallback to original text
//         }
//     }

//     // Detect language of the text
//     async detectLanguage(text: string): Promise<string> {
//         try {
//             const response = await axios.post(
//                 `https://translation.googleapis.com/language/translate/v2/detect?key=${this.apiKey}`,
//                 {
//                     q: text
//                 }
//             );

//             return response.data.data.detections[0][0].language;
//         } catch (error) {
//             console.error('Language detection error:', error);
//             return 'en'; // Default to English
//         }
//     }
// }

// export const translationService = new TranslationService();
/////
// translationService.ts
import axios from 'axios';

interface TranslationConfig {
    apiKey: string;
    baseUrl: string;
}

class TranslationService {
    private apiConfigs: TranslationConfig[] = [
        // Google Translation API Keys (multiple for fallback)
        {
            apiKey: 'AIzaSyClRzDqDh5MsXwnCWi0kOiiBivP6JsSyBw',
            baseUrl: 'https://translation.googleapis.com/language/translate/v2'
        },
        {
            apiKey: 'AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpBXqWBgw',
            baseUrl: 'https://translation.googleapis.com/language/translate/v2'
        },

        // Yandex Translation API
        {
            apiKey: 'trnsl.1.1.20230615T120000Z.abcdefghijklmnop.12345678',
            baseUrl: 'https://translate.yandex.net/api/v1/tr.json/translate'
        },

        // Microsoft Translator API
        {
            apiKey: 'YOUR_MICROSOFT_TRANSLATOR_KEY',
            baseUrl: 'https://api.cognitive.microsofttranslator.com/translate'
        }
    ];

    private currentConfigIndex: number = 0;

    async translateText(text: string, targetLanguage: string): Promise<string> {
        for (let i = 0; i < this.apiConfigs.length; i++) {
            try {
                const currentConfig = this.apiConfigs[this.currentConfigIndex];
                const translation = await this.performTranslation(
                    text,
                    targetLanguage,
                    currentConfig
                );

                return translation;
            } catch (error) {
                console.warn(`Translation failed with config ${this.currentConfigIndex}`, error);
                this.rotateConfig();
            }
        }

        // If all configs fail, return original text
        return text;
    }

    private async performTranslation(
        text: string,
        targetLanguage: string,
        config: TranslationConfig
    ): Promise<string> {
        switch (config.baseUrl) {
            case 'https://translation.googleapis.com/language/translate/v2':
                return this.googleTranslate(text, targetLanguage, config);

            case 'https://translate.yandex.net/api/v1/tr.json/translate':
                return this.yandexTranslate(text, targetLanguage, config);

            case 'https://api.cognitive.microsofttranslator.com/translate':
                return this.microsoftTranslate(text, targetLanguage, config);

            default:
                throw new Error('Unsupported translation service');
        }
    }

    private async googleTranslate(
        text: string,
        targetLanguage: string,
        config: TranslationConfig
    ): Promise<string> {
        try {
            const response = await axios.post(
                `${config.baseUrl}?key=${config.apiKey}`,
                {
                    q: text,
                    target: targetLanguage
                }
            );

            return response.data.data.translations[0].translatedText;
        } catch (error) {
            console.error('Google Translation Error:', error);
            throw error;
        }
    }

    private async yandexTranslate(
        text: string,
        targetLanguage: string,
        config: TranslationConfig
    ): Promise<string> {
        try {
            const response = await axios.get(
                config.baseUrl,
                {
                    params: {
                        key: config.apiKey,
                        text: text,
                        lang: targetLanguage
                    }
                }
            );

            return response.data.text[0];
        } catch (error) {
            console.error('Yandex Translation Error:', error);
            throw error;
        }
    }

    private async microsoftTranslate(
        text: string,
        targetLanguage: string,
        config: TranslationConfig
    ): Promise<string> {
        try {
            const response = await axios.post(
                config.baseUrl,
                {
                    headers: {
                        'Ocp-Apim-Subscription-Key': config.apiKey,
                        'Content-Type': 'application/json'
                    },
                    params: {
                        'api-version': '3.0',
                        'to': targetLanguage
                    },
                    data: [{ text: text }]
                }
            );

            return response.data[0].translations[0].text;
        } catch (error) {
            console.error('Microsoft Translation Error:', error);
            throw error;
        }
    }

    async detectLanguage(text: string): Promise<string> {
        for (const config of this.apiConfigs) {
            try {
                switch (config.baseUrl) {
                    case 'https://translation.googleapis.com/language/translate/v2':
                        return this.googleDetectLanguage(text, config);

                    default:
                        continue;
                }
            } catch (error) {
                console.warn('Language detection failed', error);
            }
        }

        return 'en'; // Default to English
    }

    private async googleDetectLanguage(
        text: string,
        config: TranslationConfig
    ): Promise<string> {
        try {
            const response = await axios.post(
                `https://translation.googleapis.com/language/translate/v2/detect?key=${config.apiKey}`,
                { q: text }
            );

            return response.data.data.detections[0][0].language;
        } catch (error) {
            console.error('Language Detection Error:', error);
            throw error;
        }
    }

    private rotateConfig() {
        this.currentConfigIndex =
            (this.currentConfigIndex + 1) % this.apiConfigs.length;
    }

    // Method to add new API configuration
    addApiConfig(config: TranslationConfig) {
        this.apiConfigs.push(config);
    }

    // Method to remove API configuration
    removeApiConfig(apiKey: string) {
        this.apiConfigs = this.apiConfigs.filter(
            config => config.apiKey !== apiKey
        );
    }
}

export const translationService = new TranslationService();
