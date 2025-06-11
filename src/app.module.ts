import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { UserConfigModule } from './user-config/user-config.module';
import { LanguageModule } from './language/language.module';
import { VocabularyModule } from './vocabulary/vocabulary.module';
import { WordModule } from './word/word.module';
import { DatabaseModule } from './database/database.module';
import { BookModule } from './book/book.module';

@Module({
    imports: [
        DatabaseModule,
        UserModule,
        UserConfigModule,
        LanguageModule,
        VocabularyModule,
        WordModule,
        BookModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
