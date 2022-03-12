import EventEmitter from "eventemitter3";
import Epub from "epubjs";
export class EpubViewerBase extends EventEmitter {
  constructor(book = Epub()) {
    super();
    this.book = book;
  }
  destroy() {
    this.book.destroy();
  }
  get size() {
    var _a, _b;
    return {
      width: (_a = this.element) == null ? void 0 : _a.clientWidth,
      height: (_b = this.element) == null ? void 0 : _b.clientHeight
    };
  }
  async initialize(input) {
    await this.book.open(input, "binary");
    await this.book.ready;
    await this.book.loaded.navigation;
  }
  display(element, options, target) {
    this.element = element;
    this.rendition = this.book.renderTo(element, {
      width: "100%",
      height: "100%",
      ...options,
      allowScriptedContent: true
    });
    this.registerEventListeners();
    this.registerThemes();
    return this.rendition.display(target);
  }
  goTo(target) {
    console.log(target);
    this.rendition.display(target);
  }
  registerEventListeners() {
    this.rendition.on("relocated", (location) => {
      this.currentLocation = location.end.cfi;
      this.currentChapter = this.getChapter(location.start.href);
      this.emit("relocated", {
        location,
        chapter: this.currentChapter
      });
    });
    this.rendition.hooks.content.register((contents, view) => {
      this.emit("content", contents.document);
    });
    this.rendition.hooks.render.register((iframeView) => {
      this.emit("render", iframeView.document);
    });
    this.listenRenditionGestureEvents();
  }
  getChapter(href) {
    const [toc] = this.book.navigation.toc.filter((toc2) => toc2.href.includes(href));
    return toc == null ? void 0 : toc.label.trim();
  }
  registerThemes() {
    this.rendition.themes.register("dark", {
      body: {
        color: "white",
        "font-size": "x-large",
        "padding-top": "0 !important",
        "padding-bottom": "0 !important"
      }
    });
    this.rendition.themes.register("light", {
      body: {
        color: "black",
        "font-size": "x-large",
        "padding-top": "0 !important",
        "padding-bottom": "0 !important"
      }
    });
    this.rendition.themes.select("light");
  }
  handleEvent(event) {
    if (!event.moved) {
      return "tap";
    } else if (event.end.x < event.start.x) {
      return "swipe:left";
    } else if (event.end.x > event.start.x) {
      return "swipe:right";
    }
  }
  listenRenditionGestureEvents() {
    const touchEvent = {
      start: { x: 0, y: 0 },
      end: { x: 0, y: 0 },
      moved: false
    };
    this.rendition.on("touchstart", (event) => {
      touchEvent.moved = false;
      touchEvent.start.x = event.changedTouches[0].screenX;
      touchEvent.start.y = event.changedTouches[0].screenY;
    });
    this.rendition.on("touchmove", () => {
      touchEvent.moved = true;
    });
    this.rendition.on("touchend", (event) => {
      touchEvent.end.x = event.changedTouches[0].screenX;
      touchEvent.end.y = event.changedTouches[0].screenY;
      const gesture = this.handleEvent(touchEvent);
      this.rendition.emit(gesture);
    });
  }
}
//# sourceMappingURL=EpubViewerBase.js.map
