import { RenditionOptions } from 'epubjs/types/rendition';
import { Epub, library, BookInfo, RelocatedEventPayload, EpubViewer } from '.';

export class StatefulEpubViewer extends EpubViewer {
  protected readonly bookInfo: BookInfo;
  constructor(epub: Epub) {
    super(epub.content);
    this.bookInfo = epub.info;
    this.on('page-changed', this.persistPagination.bind(this));
  }

  protected async persistPagination() {
    await library.updateInfo(this.bookInfo);
  }

  public async display(element: Element, options?: RenditionOptions): Promise<void> {
    const lastLocation = this.bookInfo.pagination.currentLocation?.end.cfi;
    await super.display(element, options, lastLocation);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (lastLocation && this.rendition.currentLocation().end.cfi !== lastLocation) {
      console.warn(`Last location didn't load normal: ${lastLocation}`);
      return this.goTo(lastLocation);
    }
  }

  protected registerEventListeners() {
    super.registerEventListeners();
    // rendition events
    this.on('relocated', ({ location, chapter }: RelocatedEventPayload) => {
      this.bookInfo.pagination.currentLocation = location;
      this.bookInfo.pagination.currentChapter = chapter;
      this.emit('page-changed', this.bookInfo.pagination);
    });
  }
}
