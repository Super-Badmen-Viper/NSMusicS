import { createI18n, type I18nOptions } from 'vue-i18n'

import zhHans_j from '@/i18n/locales_jellyfin/zh-cn.json';
import zhHant_j from '@/i18n/locales_jellyfin/zh-tw.json';
import en_j from '@/i18n/locales_jellyfin/en-us.json';
import es_j from '@/i18n/locales_jellyfin/es.json';
import fa_j from '@/i18n/locales_jellyfin/fa.json';
import fr_j from '@/i18n/locales_jellyfin/fr.json';
import ja_j from '@/i18n/locales_jellyfin/ja.json';
import pl_j from '@/i18n/locales_jellyfin/pl.json';
import de_j from '@/i18n/locales_jellyfin/de.json';
import it_j from '@/i18n/locales_jellyfin/it.json';
import ru_j from '@/i18n/locales_jellyfin/ru.json';
import ptBr_j from '@/i18n/locales_jellyfin/pt-br.json';
import sr_j from '@/i18n/locales_jellyfin/sr.json';
import sv_j from '@/i18n/locales_jellyfin/sv.json';
import cs_j from '@/i18n/locales_jellyfin/cs.json';
import nl_j from '@/i18n/locales_jellyfin/nl.json';

import zhHans_n from '@/i18n/locales_nsmusics/zh-Hans.json';
import zhHant_n from '@/i18n/locales_nsmusics/zh-Hant.json';
import en_n from '@/i18n/locales_nsmusics/en.json';
import es_n from '@/i18n/locales_nsmusics/es.json';
import fa_n from '@/i18n/locales_nsmusics/fa.json';
import fr_n from '@/i18n/locales_nsmusics/fr.json';
import ja_n from '@/i18n/locales_nsmusics/ja.json';
import pl_n from '@/i18n/locales_nsmusics/pl.json';
import de_n from '@/i18n/locales_nsmusics/de.json';
import it_n from '@/i18n/locales_nsmusics/it.json';
import ru_n from '@/i18n/locales_nsmusics/ru.json';
import ptBr_n from '@/i18n/locales_nsmusics/pt-BR.json';
import sr_n from '@/i18n/locales_nsmusics/sr.json';
import sv_n from '@/i18n/locales_nsmusics/sv.json';
import cs_n from '@/i18n/locales_nsmusics/cs.json';
import nl_n from '@/i18n/locales_nsmusics/nl.json';

import zhHans from '@/i18n/locales_feishin/zh-Hans.json';
import zhHant from '@/i18n/locales_feishin/zh-Hant.json';
import en from '@/i18n/locales_feishin/en.json';
import es from '@/i18n/locales_feishin/es.json';
import fa from '@/i18n/locales_feishin/fa.json';
import fr from '@/i18n/locales_feishin/fr.json';
import ja from '@/i18n/locales_feishin/ja.json';
import pl from '@/i18n/locales_feishin/pl.json';
import de from '@/i18n/locales_feishin/de.json';
import it from '@/i18n/locales_feishin/it.json';
import ru from '@/i18n/locales_feishin/ru.json';
import ptBr from '@/i18n/locales_feishin/pt-BR.json';
import sr from '@/i18n/locales_feishin/sr.json';
import sv from '@/i18n/locales_feishin/sv.json';
import cs from '@/i18n/locales_feishin/cs.json';
import nl from '@/i18n/locales_feishin/nl.json';

export class Language{
    public i18n:any;
    constructor() {
        const options: I18nOptions = {
            legacy: false,
            locale: 'zhHans',
            messages: {
                'zhHans': { ...zhHans, ...zhHans_n, ...zhHans_j },
                'zhHant': { ...zhHant, ...zhHant_n, ...zhHant_j },
                'en': { ...en, ...en_n, ...en_j },
                'es': { ...es, ...es_n, ...es_j },
                'fa': { ...fa, ...fa_n, ...fa_j },
                'fr': { ...fr, ...fr_n, ...fr_j },
                'ja': { ...ja, ...ja_n, ...ja_j },
                'pl': { ...pl, ...pl_n, ...pl_j },
                'de': { ...de, ...de_n, ...de_j },
                'it': { ...it, ...it_n, ...it_j },
                'ru': { ...ru, ...ru_n, ...ru_j },
                'ptBr': { ...ptBr, ...ptBr_n, ...ptBr_j },
                'sr': { ...sr, ...sr_n, ...sr_j },
                'sv': { ...sv, ...sv_n, ...sv_j },
                'cs': { ...cs, ...cs_n, ...cs_j },
                'nl': { ...nl, ...nl_n, ...nl_j }
            }
        }
        this.i18n = createI18n<false, typeof options>(options)
    }
}