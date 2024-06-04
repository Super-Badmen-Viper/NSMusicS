import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import ja from './locales/ja.json';
import pl from './locales/pl.json';
import zhHans from './locales/zh-Hans.json';
import de from './locales/de.json';
import it from './locales/it.json';
import ru from './locales/ru.json';
import ptBr from './locales/pt-BR.json';
import sr from './locales/sr.json';
import sv from './locales/sv.json';
import cs from './locales/cs.json';
import nl from './locales/nl.json';
export class Language{
    public i18n:any;
    public languages:any;
    constructor() {
        this.languages = [
            {
                label: 'English',
                value: 'en',
            },
            {
                label: 'Čeština',
                value: 'cs',
            },
            {
                label: 'Español',
                value: 'es',
            },
            {
                label: 'Deutsch',
                value: 'de',
            },
            {
                label: 'Français',
                value: 'fr',
            },
            {
                label: 'Italiano',
                value: 'it',
            },
            {
                label: '日本語',
                value: 'ja',
            },
            {
                label: 'Nederlands',
                value: 'nl',
            },
            {
                label: 'Norsk (Bokmål)',
                value: 'nb-NO',
            },
        
            {
                label: 'Português (Brasil)',
                value: 'pt-BR',
            },
            {
                label: 'Polski',
                value: 'pl',
            },
            {
                label: 'Русский',
                value: 'ru',
            },
            {
                label: 'Srpski',
                value: 'sr',
            },
            {
                label: 'Svenska',
                value: 'sv',
            },
            {
                label: '简体中文',
                value: 'zh-Hans',
            },
        ];
        type MessageSchema = typeof ja
        this.i18n = createI18n<[MessageSchema], 'ja' | 'cs'>({
            locale: 'ja',
            messages: {
                'ja': ja
            }
        })
    }
}