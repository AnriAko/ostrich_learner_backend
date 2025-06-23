import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

class Translation {
    @Column() pos_id: number; // pos in array of words
    @Column() translation_id: number; // id from mysql of translation
    @Column() origin: string; // origin word for fast access
    @Column() translation: string; // translation for fast access
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
