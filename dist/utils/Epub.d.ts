import { Book, Location } from 'epubjs';
import { PackagingMetadataObject } from 'epubjs/types/packaging';
export interface Size2D {
    width: number;
    height: number;
}
export interface Pagination {
    size: Size2D;
    pages: string[];
    currentPage: number | '-';
    currentChapter: string;
    currentLocation?: Location;
}
export interface BookInfo extends PackagingMetadataObject {
    id: string;
    pagination: Pagination;
}
export declare class Epub {
    readonly info: BookInfo;
    readonly content: ArrayBuffer;
    private static extractCover;
    static load(content: ArrayBuffer): Book;
    static fromArrayBuffer(content: ArrayBuffer): Promise<Epub>;
    static fromFileDialog(): Promise<Epub>;
    constructor(info: BookInfo, content: ArrayBuffer);
}
