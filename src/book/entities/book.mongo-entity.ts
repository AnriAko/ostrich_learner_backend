import { ObjectId } from 'mongodb';
import { Entity, ObjectIdColumn, Column } from 'typeorm';

class Word {
    @Column() w: string; // word or symbol
    @Column() fs: number; // font size
    @Column() fn: string; // font name
    @Column() fw: string; // font weight (bold/normal)
    @Column() fst: string; // font style (italic/normal)
    @Column() c: string; // color (e.g., rgb(0,0,0))
    @Column() x: number; // x coordinate
    @Column() y: number; // y coordinate
    @Column() sup: boolean; // is superscript
    @Column() sub: boolean; // is subscript
}

class ImagePosition {
    @Column() x: number; // image top-left x
    @Column() y: number; // image top-left y
    @Column() w: number; // image width
    @Column() h: number; // image height
}

class ImageData {
    @Column() b64: string; // base64 encoded image
    @Column(() => ImagePosition) pos: ImagePosition; // image position
}

class PageSize {
    @Column() w: number; // page width
    @Column() h: number; // page height
}

class Translation {
    @Column() pos_id: number; // index of word in txt array
    @Column() translation_id: number; // mysql translation id
    @Column() word: string; // original word (redundant, for fast access)
    @Column() translation: string; // translation text
}

class Page {
    @Column(() => PageSize) s: PageSize; // size of page
    @Column(() => ImageData) imgs: ImageData[]; // images on the page
    @Column(() => Word) txt: Word[]; // extracted words on the page
    @Column(() => Translation) t: Translation[]; // word translations
}

@Entity('pdf_to_json_books')
export class PdfEntity {
    @ObjectIdColumn() _id: ObjectId; // MongoDB object id

    @Column() pdf: string; // PDF file name

    @Column() meta: any; // metadata from PDF (title, author, etc.)

    @Column() p_count: number; // number of pages in PDF

    @Column(() => Page) p: Page[]; // pages with text + images

    @Column() userId: string; // user id
}
