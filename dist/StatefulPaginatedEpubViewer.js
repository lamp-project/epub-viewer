import {
  library,
  PaginatedEpubViewer
} from ".";
export class StatefulPaginatedEpubViewer extends PaginatedEpubViewer {
  constructor(epub) {
    super(epub.content);
    this.bookInfo = epub.info;
    this.on("page-changed", this.persistPagination.bind(this));
  }
  async persistPagination() {
    await library.updateInfo(this.bookInfo);
  }
  async display(element, options) {
    var _a;
    const lastLocation = (_a = this.bookInfo.pagination.currentLocation) == null ? void 0 : _a.end.cfi;
    await super.display(element, options, lastLocation);
    if (this.rendition.currentLocation().end.cfi !== lastLocation) {
      console.warn(`Last location didn't load normal: ${lastLocation}`);
      return this.goTo(lastLocation);
    }
  }
  paginate() {
    if (this.bookInfo.pagination.size.width === this.size.width && this.bookInfo.pagination.size.height === this.size.height) {
      this.pages = this.bookInfo.pagination.pages;
      console.log("pagination will load from cache");
    } else {
      return super.paginate();
    }
  }
  registerEventListeners() {
    super.registerEventListeners();
    this.on("relocated", ({ location, chapter }) => {
      this.bookInfo.pagination.currentLocation = location;
      this.bookInfo.pagination.currentChapter = chapter;
      this.bookInfo.pagination.currentPage = this.currentPage;
      this.emit("page-changed", this.bookInfo.pagination);
    });
    this.on("pagination-update", () => {
      this.bookInfo.pagination.pages = this.pages;
      this.bookInfo.pagination.currentPage = this.currentPage;
      this.emit("page-changed", this.bookInfo.pagination);
    });
    this.on("pagination-done", () => {
      this.bookInfo.pagination.pages = this.pages;
      this.bookInfo.pagination.size = this.size;
      this.emit("page-changed", this.bookInfo.pagination);
    });
  }
}
