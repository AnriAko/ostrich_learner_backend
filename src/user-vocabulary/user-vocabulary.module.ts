import { Module } from '@nestjs/common';
import { UserVocabularyService } from './user-vocabulary.service';
import { UserVocabularyController } from './user-vocabulary.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserVocabulary } from './entities/user-vocabulary.entity';
import { User } from 'src/user/entities/user.entity';
import { Language } from 'src/language/entities/language.entity';

@Module({
    imports: [TypeOrmModule.forFeature([UserVocabulary, User, Language])],
    controllers: [UserVocabularyController],
    providers: [UserVocabularyService],
})
export class UserVocabularyModule {}
