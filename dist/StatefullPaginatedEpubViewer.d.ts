import * as Epub from 'epubjs';
import { RenditionOptions } from 'epubjs/types/rendition';
import { PaginatedEpubViewer } from './PaginatedEpubViewer';
export interface Size2D {
    width: number;
    height: number;
}
export interface Pagination {
    size: Size2D;
    pages: string[];
    currentPage: number | '-';
    currentChapter: string;
    currentLocation?: Epub.Location;
}
export declare class StatefullPaginatedEpubViewer extends PaginatedEpubViewer {
    private readonly id;
    readonly pagination: Pagination;
    constructor(id: string, content: ArrayBuffer);
    protected persistPagination(): void;
    display(element: Element, options?: RenditionOptions): Promise<void>;
    /**
     * Skipping pagination if exists
     */
    protected paginate(): Promise<void>;
    protected registerEventListeners(): void;
}
