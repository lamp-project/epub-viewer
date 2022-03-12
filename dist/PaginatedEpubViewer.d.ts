import { RenditionOptions } from 'epubjs/types/rendition';
import { EpubPaginator, PaginateEventPayload } from './EpubPaginator';
import { EpubViewer } from './EpubViewer';
export interface PaginationUpdateEventPayload extends PaginateEventPayload {
    currentPage?: number;
}
export interface PaginationDoneEventPayload {
    pages: string[];
    currentPage?: number;
}
export declare class PaginatedEpubViewer extends EpubViewer {
    protected paginator: EpubPaginator;
    protected pages: string[];
    get currentPage(): number | "-";
    display(element: Element, options?: RenditionOptions, target?: string): Promise<void>;
    protected paginate(): Promise<void>;
    protected registerEventListeners(): void;
    destroy(): void;
}
