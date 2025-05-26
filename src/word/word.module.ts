import { Module } from '@nestjs/common';
import { WordService } from './word.service';
import { WordController } from './word.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Word } from './entities/word.entity';
import { Vocabulary } from 'src/vocabulary/entities/vocabulary.entity';
import { VocabularyModule } from 'src/vocabulary/vocabulary.module';
import { User } from 'src/user/entities/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Word, Vocabulary, User]),
        VocabularyModule,
    ],
    controllers: [WordController],
    providers: [WordService],
})
export class WordModule {}
