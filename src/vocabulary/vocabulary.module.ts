import { Module } from '@nestjs/common';
import { VocabularyService } from './vocabulary.service';
import { VocabularyController } from './vocabulary.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vocabulary } from './entities/vocabulary.entity';
import { User } from 'src/user/entities/user.entity';
import { Language } from 'src/language/entities/language.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Vocabulary, User, Language])],
    controllers: [VocabularyController],
    providers: [VocabularyService],
    exports: [VocabularyService],
})
export class VocabularyModule {}
