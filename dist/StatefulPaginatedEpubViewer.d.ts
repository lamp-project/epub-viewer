import { RenditionOptions } from 'epubjs/types/rendition';
import { Epub, BookInfo, PaginatedEpubViewer } from '.';
export declare class StatefulPaginatedEpubViewer extends PaginatedEpubViewer {
    protected readonly bookInfo: BookInfo;
    constructor(epub: Epub);
    protected persistPagination(): Promise<void>;
    display(element: Element, options?: RenditionOptions): Promise<void>;
    /**
     * Skipping pagination if exists
     */
    protected paginate(): Promise<void>;
    protected registerEventListeners(): void;
}
