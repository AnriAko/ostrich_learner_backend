import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

export class Translation {
    @Column()
    pos_id: number;

    @Column()
    translation_id: number;

    @Column()
    origin: string;

    @Column()
    translation: string;

    @Column()
    sourceLang: string;

    @Column()
    targetLang: string;
}

class Page {
    @Column() t: string;
    @Column(() => Translation) tr: Translation[];
}

@Entity('book')
export class Book {
    @ObjectIdColumn() _id: ObjectId; // object id

    @Column() b: string; //book name

    @Column() p_count: number; // page count

    @Column(() => Page) p: Page[]; // page with text array

    @Column() userId: string; // user id
}
