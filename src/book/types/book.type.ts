import { ObjectId } from 'mongodb';
import { PageType } from './page.type';

export interface BookType {
    _id: ObjectId;
    b: string;
    p_count: number;
    p: PageType[];
    userId: string;
}
