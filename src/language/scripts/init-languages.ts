import { Injectable, OnModuleInit } from '@nestjs/common';
import { LanguageService } from '../language.service';
import { SupportedLanguages } from '../constants/supported-languages';

@Injectable()
export class LanguageInitializer implements OnModuleInit {
    constructor(private readonly languageService: LanguageService) {}

    async onModuleInit() {
        for (const lang of SupportedLanguages) {
            const exists = await this.languageService
                .findOne(lang.id)
                .catch(() => null);
            if (!exists) {
                await this.languageService.create(lang);
            }
        }
    }
}
