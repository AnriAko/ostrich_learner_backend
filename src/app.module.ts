import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { UserConfigModule } from './user-config/user-config.module';
import { LanguageModule } from './language/language.module';
import { UserVocabularyModule } from './user-vocabulary/user-vocabulary.module';
import { UserVocabularyWordModule } from './user-vocabulary-words/user-vocabulary-words.module';
import { DatabaseModule } from './database/database.module';

@Module({
    imports: [
        DatabaseModule,
        UserModule,
        UserConfigModule,
        LanguageModule,
        UserVocabularyModule,
        UserVocabularyWordModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
