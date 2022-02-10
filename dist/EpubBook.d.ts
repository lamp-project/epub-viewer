import { Book } from 'epubjs';
import { PackagingMetadataObject } from 'epubjs/types/packaging';
export declare class EpubBook {
    readonly metadata: PackagingMetadataObject;
    readonly cover: Blob;
    readonly content?: ArrayBuffer;
    static extractBookCover(book: Book): Promise<Blob>;
    static extractMeta(content: ArrayBuffer): Promise<{
        cover: Blob;
        metadata: any;
    }>;
    static importEpubFromFileDialog(): Promise<EpubBook>;
}
