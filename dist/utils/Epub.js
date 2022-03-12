import { v4 as uuid } from "uuid";
import fileDialog from "file-dialog";
import loadEbpub from "epubjs";
export class Epub {
  constructor(info, content) {
    this.info = info;
    this.content = content;
  }
  static async extractCover(book) {
    await book.loaded.cover;
    const { coverPath } = book.packaging;
    if (coverPath) {
      return book.archive.getBlob(book.resolve(coverPath));
    } else {
      return null;
    }
  }
  static load(content) {
    return loadEbpub(content);
  }
  static async fromArrayBuffer(content) {
    var _a;
    const book = loadEbpub(content);
    const cover = await this.extractCover(book);
    const info = {
      ...JSON.parse(JSON.stringify((_a = book.packaging) == null ? void 0 : _a.metadata)),
      cover,
      id: uuid(),
      pagination: {
        pages: [],
        currentPage: 1,
        currentChapter: "",
        size: { width: 0, height: 0 },
        currentLocation: {
          start: { displayed: { page: 0, total: -1 } },
          end: { displayed: { page: 0, total: -1 } }
        }
      }
    };
    await book.destroy();
    return new Epub(info, content);
  }
  static async fromFileDialog() {
    const selectedFiles = await fileDialog({ accept: "application/epub+zip" });
    const content = await selectedFiles.item(0).arrayBuffer();
    return this.fromArrayBuffer(content);
  }
}
//# sourceMappingURL=Epub.js.map
