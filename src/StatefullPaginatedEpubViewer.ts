import * as Epub from 'epubjs';
import { RenditionOptions } from 'epubjs/types/rendition';
import { PaginatedEpubViewer } from './PaginatedEpubViewer';
import { RelocatedEventPayload } from './EpubViewerBase';

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

export class StatefullPaginatedEpubViewer extends PaginatedEpubViewer {
	public readonly pagination: Pagination = {
		pages: [],
		currentPage: 1,
		currentChapter: '',
		size: { width: 0, height: 0 },
	};
	constructor(private readonly id: string, content: ArrayBuffer) {
		super(content);
		const value = localStorage.getItem(id);
		if (value) {
			this.pagination = JSON.parse(value);
		} else {
			this.persistPagination();
		}
		this.on('item-updated', this.persistPagination.bind(this));
	}

	protected persistPagination() {
		localStorage.setItem(this.id, JSON.stringify(this.pagination));
	}

	public display(element: Element, options?: RenditionOptions): Promise<void> {
		return super.display(
			element,
			options,
			this.pagination.currentLocation?.start.cfi,
		);
	}

	/**
	 * Skipping pagination if exists
	 */
	protected paginate() {
		if (
			this.pagination.size.width === this.size.width &&
			this.pagination.size.height === this.size.height
		) {
			this.pages = this.pagination.pages;
			console.log('pagination will load from cache');
		} else {
			return super.paginate();
		}
	}

	protected registerEventListeners() {
		super.registerEventListeners();
		// rendition events
		this.on('relocated', ({ location, chapter }: RelocatedEventPayload) => {
			this.pagination.currentLocation = location;
			this.pagination.currentChapter = chapter;
			this.pagination.currentPage = this.currentPage;
			this.emit('item-updated');
		});

		// pagination events
		this.on('pagination-update', () => {
			this.pagination.pages = this.pages;
			this.pagination.currentPage = this.currentPage;
			this.emit('item-updated');
		});

		this.on('pagination-done', () => {
			this.pagination.pages = this.pages;
			this.pagination.size = this.size;
			this.emit('item-updated');
		});
	}
}
