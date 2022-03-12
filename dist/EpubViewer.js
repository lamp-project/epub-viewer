import { EpubViewerBase } from "./EpubViewerBase";
export class EpubViewer extends EpubViewerBase {
  constructor(input) {
    super();
    this.input = input;
  }
  async initialize() {
    await super.initialize(this.input);
    delete this.input;
  }
  registerEventListeners() {
    super.registerEventListeners();
    this.rendition.on("swipe:left", this.applyLeftEvent.bind(this));
    this.rendition.on("swipe:right", this.applyRightEvent.bind(this));
    this.rendition.on("keyup", this.listenKeyUpEvents.bind(this));
    document.addEventListener("keyup", this.listenKeyUpEvents.bind(this), false);
    this.rendition.on("click", () => this.emit("click-tap"));
  }
  listenKeyUpEvents({ code }) {
    if (code === "ArrowLeft") {
      this.applyRightEvent();
    }
    if (code === "ArrowRight") {
      this.applyLeftEvent();
    }
  }
  applyRightEvent() {
    var _a, _b;
    ((_b = (_a = this.book.packaging) == null ? void 0 : _a.metadata) == null ? void 0 : _b.direction) === "rtl" ? this.rendition.next() : this.rendition.prev();
  }
  applyLeftEvent() {
    var _a, _b;
    ((_b = (_a = this.book.packaging) == null ? void 0 : _a.metadata) == null ? void 0 : _b.direction) === "rtl" ? this.rendition.prev() : this.rendition.next();
  }
}
