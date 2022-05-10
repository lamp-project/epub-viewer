/* eslint-disable no-console */
import { Book } from 'epubjs';
import { RenditionOptions } from 'epubjs/types/rendition';
import { EpubViewerBase, RelocatedEventPayload } from './EpubViewerBase';

export interface PaginateEventPayload {
  pages: string[];
  cfi: string;
}
export class EpubPaginator extends EpubViewerBase {
  public readonly pages: string[] = [];
  private readonly container = document.createElement('div');
  private working = false;
  constructor(book: Book) {
    super(book);
    this.container.style.position = 'fixed';
    this.container.style.left = '200vw';
    document.body.append(this.container);
    this.on('relocated', this.listenRelocate.bind(this));
  }

  public async paginate(options: RenditionOptions): Promise<string[]> {
    this.working = true;
    console.time('rendering all pages');
    const waiter = new Promise<string[]>((resolve) => {
      this.on('done', resolve);
      this.on('terminated', resolve);
    });
    await this.display(this.container, options);
    const pages = await waiter;
    this.destroy();
    console.timeEnd('rendering all pages');
    return pages;
  }

  private listenRelocate({ location }: RelocatedEventPayload) {
    this.pages.push(location.end.cfi);
    this.emit('paginate', {
      pages: this.pages,
      cfi: location.end.cfi,
    } as PaginateEventPayload);
    if (location.atEnd) {
      this.emit('done', this.pages);
    } else if (this.working) {
      this.rendition.next();
    } else {
      console.info('pagination stopped !');
      this.emit('terminated', this.pages);
    }
  }

  destroy() {
    this.working = false;
    this.removeAllListeners();
    this.container.remove();
    this.rendition.destroy();
  }
}
