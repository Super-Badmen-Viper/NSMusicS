import { createI18n, type I18nOptions } from 'vue-i18n'

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

import {Class_Get_System_Configs_Read} from "@/features/system_configs/class_Get_System_Configs_Read";

export class Language{
    public i18n:any;
    constructor() {
        let system_Configs_Read = new Class_Get_System_Configs_Read();
        const options: I18nOptions = {
            legacy: false,
            locale: '' + system_Configs_Read.app_Configs.value['lang'],
            messages: {
                'zhHans': { ...zhHans, ...zhHans_n },
                'zhHant': { ...zhHant, ...zhHant_n },
                'en': { ...en, ...en_n },
                'es': { ...es, ...es_n },
                'fa': { ...fa, ...fa_n },
                'fr': { ...fr, ...fr_n },
                'ja': { ...ja, ...ja_n },
                'pl': { ...pl, ...pl_n },
                'de': { ...de, ...de_n },
                'it': { ...it, ...it_n },
                'ru': { ...ru, ...ru_n },
                'ptBr': { ...ptBr, ...ptBr_n },
                'sr': { ...sr, ...sr_n },
                'sv': { ...sv, ...sv_n },
                'cs': { ...cs, ...cs_n },
                'nl': { ...nl, ...nl_n }
            }
        }
        this.i18n = createI18n<false, typeof options>(options)
    }
}