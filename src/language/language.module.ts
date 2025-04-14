import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Language } from './entities/language.entity';
import { LanguageService } from './language.service';
import { LanguageInitializer } from './scripts/init-languages';

@Module({
    imports: [TypeOrmModule.forFeature([Language])],
    providers: [LanguageService, LanguageInitializer],
    exports: [LanguageService],
})
export class LanguageModule {}
