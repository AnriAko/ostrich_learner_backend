import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Language } from './entities/language.entity';

@Injectable()
export class LanguageService {
    constructor(
        @InjectRepository(Language)
        private readonly languageRepository: Repository<Language>
    ) {}

    async create(language: Language): Promise<Language> {
        return this.languageRepository.save(language);
    }

    async findAll(): Promise<Language[]> {
        return this.languageRepository.find();
    }

    async findOne(id: string): Promise<Language> {
        const lang = await this.languageRepository.findOne({ where: { id } });
        if (!lang) throw new NotFoundException('Language not found');
        return lang;
    }

    async update(id: string, data: Partial<Language>): Promise<Language> {
        const lang = await this.findOne(id);
        Object.assign(lang, data);
        return this.languageRepository.save(lang);
    }

    async remove(id: string): Promise<void> {
        const lang = await this.findOne(id);
        await this.languageRepository.remove(lang);
    }
}
