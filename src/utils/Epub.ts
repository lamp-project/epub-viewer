import { v4 as uuid } from 'uuid';
import fileDialog from 'file-dialog';
import loadEbpub, { Book, Location } from 'epubjs';
import { PackagingMetadataObject } from 'epubjs/types/packaging';

export interface Size2D {
  width: number;
  height: number;
}

export interface Pagination {
  size: Size2D;
  pages: string[];
  currentPage: number | '-';
  currentChapter?: string;
  currentLocation?: Location;
}
export interface BookInfo extends PackagingMetadataObject {
  id: string;
  pagination: Pagination;
  cover?: Blob;
}

export class Epub {
  private static async extractCover(book: Book) {
    await book.loaded.cover;
    const { coverPath } = book.packaging;
    if (coverPath) {
      return book.archive.getBlob(book.resolve(coverPath));
    } else {
      return null;
    }
  }

  public static load(content: ArrayBuffer): Book {
    return loadEbpub(content);
  }

  public static async fromArrayBuffer(content: ArrayBuffer, id: string): Promise<Epub> {
    const book = loadEbpub(content);
    const cover = await this.extractCover(book);
    const info: BookInfo = {
      ...JSON.parse(JSON.stringify(book.packaging?.metadata)),
      cover,
      id,
      pagination: {
        pages: [],
        currentPage: 1,
        currentChapter: '',
        size: { width: 0, height: 0 },
        currentLocation: {
          start: { displayed: { page: 0, total: -1 } },
          end: { displayed: { page: 0, total: -1 } },
        },
      },
    };
    await book.destroy();
    return new Epub(info, content);
  }

  public static async fromFileDialog(): Promise<Epub | undefined> {
    const selectedFiles = await fileDialog({ accept: 'application/epub+zip' });
    const content = await selectedFiles.item(0)?.arrayBuffer();
    if (content) {
      return this.fromArrayBuffer(content, uuid());
    }
  }

  constructor(public readonly info: BookInfo, public readonly content: ArrayBuffer) {}
}
