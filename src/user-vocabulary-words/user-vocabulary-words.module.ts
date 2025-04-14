import { Module } from '@nestjs/common';
import { UserVocabularyWordService } from './user-vocabulary-words.service';
import { UserVocabularyWordController } from './user-vocabulary-words.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserVocabularyWord } from './entities/user-vocabulary-word.entity';
import { UserVocabularyModule } from 'src/user-vocabulary/user-vocabulary.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserVocabularyWord]),
        UserVocabularyModule,
    ],
    controllers: [UserVocabularyWordController],
    providers: [UserVocabularyWordService],
})
export class UserVocabularyWordModule {}
