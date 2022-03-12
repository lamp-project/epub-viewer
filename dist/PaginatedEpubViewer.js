import debounce from "debounce";
import { EpubPaginator } from "./EpubPaginator";
import { EpubViewer } from "./EpubViewer";
export class PaginatedEpubViewer extends EpubViewer {
  get currentPage() {
    return this.pages ? this.pages.indexOf(this.currentLocation) + 1 : "-";
  }
  async display(element, options, target) {
    await super.display(element, options, target);
    this.paginate();
  }
  async paginate() {
    if (this.paginator) {
      this.paginator.destroy();
      delete this.paginator;
    }
    this.paginator = new EpubPaginator(this.book);
    this.paginator.on("paginate", ({ pages, cfi }) => {
      this.pages = pages;
      this.emit("pagination-update", {
        pages,
        cfi,
        currentPage: this.currentPage
      });
    });
    this.paginator.on("done", (pages) => {
      this.pages = pages;
      this.emit("pagination-done", {
        pages,
        currentPage: this.currentPage
      });
    });
    await this.paginator.paginate(this.size);
  }
  registerEventListeners() {
    super.registerEventListeners();
    this.rendition.on("resized", debounce(async ({ width, height }) => {
      console.log(`Resized: ${width}x${height}`);
      await this.paginate();
    }, 500));
  }
  destroy() {
    var _a;
    (_a = this.paginator) == null ? void 0 : _a.destroy();
    super.destroy();
  }
}
