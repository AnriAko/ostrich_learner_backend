export class Translation {
    pos_id: number;
    translation_id: number;
    origin: string;
    translation: string;
    sourceLang: string;
    targetLang: string;
}

export class Page {
    t: string;
    tr: Translation[];
}

export interface PageType {
    t: string;
    tr: Translation[];
}
