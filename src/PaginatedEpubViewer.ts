/* eslint-disable no-console */
import debounce from 'debounce';
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

export class PaginatedEpubViewer extends EpubViewer {
	protected paginator: EpubPaginator;
	protected pages: string[];

	public get currentPage() {
		return this.pages ? this.pages.indexOf(this.currentLocation) + 1 : '-';
	}

	public async display(
		element: Element,
		options?: RenditionOptions,
		target?: string,
	) {
		await super.display(element, options, target);
		this.paginate();
	}

	protected async paginate() {
		if (this.paginator) {
			this.paginator.destroy();
			delete this.paginator;
		}
		this.paginator = new EpubPaginator(this.book);
		this.paginator.on('paginate', ({ pages, cfi }: PaginateEventPayload) => {
			this.pages = pages;
			this.emit('pagination-update', {
				pages,
				cfi,
				currentPage: this.currentPage,
			} as PaginationUpdateEventPayload);
		});
		this.paginator.on('done', (pages) => {
			this.pages = pages;
			this.emit('pagination-done', {
				pages,
				currentPage: this.currentPage,
			} as PaginationDoneEventPayload);
		});
		await this.paginator.paginate(this.size);
	}

	protected registerEventListeners() {
		super.registerEventListeners();
		// paginate again after any resize
		this.rendition.on(
			'resized',
			debounce(async ({ width, height }) => {
				console.log(`Resized: ${width}x${height}`);
				await this.paginate();
			}, 500),
		);
	}

	destroy(): void {
		this.paginator?.destroy();
		super.destroy();
	}
}
