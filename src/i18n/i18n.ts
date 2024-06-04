import { createI18n, type I18nOptions } from 'vue-i18n'
import zhHans from './locales/zh-Hans.json';
import zhHant from './locales/zh-Hant.json';
import en from './locales/en.json';
import es from './locales/es.json';
import fa from './locales/fa.json';
import fr from './locales/fr.json';
import ja from './locales/ja.json';
import pl from './locales/pl.json';
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
    constructor() {
        const options: I18nOptions = {
            legacy: false,
            locale: 'zhHans',
            messages: {
                'zhHans': zhHans,
                'zhHant': zhHant,
                'en': en,
                'es': es,
                'fa': fa,
                'fr': fr,
                'ja': ja,
                'pl': pl,
                'de': de,
                'it': it,
                'ru': ru,
                'ptBr': ptBr,
                'sr': sr,
                'sv': sv,
                'cs': cs,
                'nl': nl,
            }
        }
        this.i18n = createI18n<false, typeof options>(options)
    }
}