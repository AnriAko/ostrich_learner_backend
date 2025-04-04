import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { UserConfigModule } from './user-config/user-config.module';
import { LanguageModule } from './language/language.module';
import { UserLearningLanguageModule } from './user-learning-language/user-learning-language.module';
import { UserVocabularyModule } from './user-vocabulary/user-vocabulary.module';
import { UserVocabularyWordsModule } from './user-vocabulary-words/user-vocabulary-words.module';
import { ConfigModule } from '@nestjs/config';
import { WordModule } from './word/word.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
            isGlobal: true,
        }),
        DatabaseModule,
        UserModule,
        UserConfigModule,
        LanguageModule,
        UserLearningLanguageModule,
        UserVocabularyModule,
        UserVocabularyWordsModule,
        WordModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
