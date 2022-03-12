import { EpubViewerBase } from "./EpubViewerBase";
export class EpubPaginator extends EpubViewerBase {
  constructor(book) {
    super(book);
    this.pages = [];
    this.container = document.createElement("div");
    this.working = false;
    this.container.style.position = "fixed";
    this.container.style.left = "200vw";
    document.body.append(this.container);
    this.on("relocated", this.listenRelocate.bind(this));
  }
  async paginate(options) {
    this.working = true;
    console.time("rendering all pages");
    const waiter = new Promise((resolve) => {
      this.on("done", resolve);
      this.on("terminated", resolve);
    });
    await this.display(this.container, options);
    const pages = await waiter;
    this.destroy();
    console.timeEnd("rendering all pages");
    return pages;
  }
  listenRelocate({ location }) {
    this.pages.push(location.end.cfi);
    this.emit("paginate", {
      pages: this.pages,
      cfi: location.end.cfi
    });
    if (location.atEnd) {
      this.emit("done", this.pages);
    } else if (this.working) {
      this.rendition.next();
    } else {
      console.info("pagination stopped !");
      this.emit("terminated", this.pages);
    }
  }
  destroy() {
    this.working = false;
    this.removeAllListeners();
    this.container.remove();
    this.rendition.destroy();
  }
}
