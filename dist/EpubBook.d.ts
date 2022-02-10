import { Book } from 'epubjs';
import { PackagingMetadataObject } from 'epubjs/types/packaging';
export declare class EpubBook {
    metadata: PackagingMetadataObject;
    cover: Blob;
    content?: ArrayBuffer;
    static extractBookCover(book: Book): Promise<Blob>;
    static extractMeta(content: ArrayBuffer): Promise<{
        cover: Blob;
        metadata: any;
    }>;
    static importEpubFromFileDialog(): Promise<EpubBook>;
}
