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

export class Page {
    @Column()
    t: string;

    @Column(() => Translation)
    tr: Translation[];
}

@Entity('book')
export class Book {
    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    b: string;

    @Column()
    p_count: number;

    @Column(() => Page)
    p: Page[];

    @Column()
    userId: string;

    @Column({ nullable: true })
    lastViewedPage?: number;

    @Column({ nullable: true })
    lastViewedPageSize?: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    lastUpdated: Date;
}
