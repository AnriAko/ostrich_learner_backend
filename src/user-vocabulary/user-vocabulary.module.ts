import { Module } from '@nestjs/common';
import { UserVocabularyService } from './user-vocabulary.service';
import { UserVocabularyController } from './user-vocabulary.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserVocabulary } from './entities/user-vocabulary.entity';

@Module({
    imports: [TypeOrmModule.forFeature([UserVocabulary])],
    controllers: [UserVocabularyController],
    providers: [UserVocabularyService],
})
export class UserVocabularyModule {}
