import { RenditionOptions } from 'epubjs/types/rendition';
import {
	Epub,
	library,
	BookInfo,
	PaginatedEpubViewer,
	RelocatedEventPayload,
} from '.';

export class StatefulPaginatedEpubViewer extends PaginatedEpubViewer {
	protected readonly bookInfo: BookInfo;
	constructor(epub: Epub) {
		super(epub.content);
		this.bookInfo = epub.info;
		this.on('page-changed', this.persistPagination.bind(this));
	}

	protected async persistPagination() {
		await library.updateInfo(this.bookInfo);
	}

	public display(element: Element, options?: RenditionOptions): Promise<void> {
		return super.display(
			element,
			options,
			this.bookInfo.pagination.currentLocation?.end.cfi,
		);
	}

	/**
	 * Skipping pagination if exists
	 */
	protected paginate() {
		if (
			this.bookInfo.pagination.size.width === this.size.width &&
			this.bookInfo.pagination.size.height === this.size.height
		) {
			this.pages = this.bookInfo.pagination.pages;
			console.log('pagination will load from cache');
		} else {
			return super.paginate();
		}
	}

	protected registerEventListeners() {
		super.registerEventListeners();
		// rendition events
		this.on('relocated', ({ location, chapter }: RelocatedEventPayload) => {
			this.bookInfo.pagination.currentLocation = location;
			this.bookInfo.pagination.currentChapter = chapter;
			this.bookInfo.pagination.currentPage = this.currentPage;
			this.emit('page-changed', this.bookInfo.pagination);
		});

		// pagination events
		this.on('pagination-update', () => {
			this.bookInfo.pagination.pages = this.pages;
			this.bookInfo.pagination.currentPage = this.currentPage;
			this.emit('page-changed', this.bookInfo.pagination);
		});

		this.on('pagination-done', () => {
			this.bookInfo.pagination.pages = this.pages;
			this.bookInfo.pagination.size = this.size;
			this.emit('page-changed', this.bookInfo.pagination);
		});
	}
}
