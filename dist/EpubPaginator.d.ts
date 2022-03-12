import { Book } from 'epubjs';
import { RenditionOptions } from 'epubjs/types/rendition';
import { EpubViewerBase } from './EpubViewerBase';
export interface PaginateEventPayload {
    pages: string[];
    cfi: string;
}
export declare class EpubPaginator extends EpubViewerBase {
    readonly pages: string[];
    private readonly container;
    private working;
    constructor(book: Book);
    paginate(options: RenditionOptions): Promise<string[]>;
    private listenRelocate;
    destroy(): void;
}
