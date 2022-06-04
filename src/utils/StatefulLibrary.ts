import localforage from 'localforage';
import { EventEmitter } from 'eventemitter3';
import { Epub, BookInfo } from './Epub';

const LAST_BOOK_ID = 'last-book-id';
const catalogue = localforage.createInstance({ name: 'catalogue' });
const shelf = localforage.createInstance({ name: 'shelf' });
const memory = localforage.createInstance({ name: 'memory' });

export class StatefulLibrary extends EventEmitter {
  /**
   * @returns the new library item
   */
  public async add(epub: Epub, id?: string): Promise<Epub> {
    await catalogue.setItem(id ?? epub.info.id, epub.info);
    await shelf.setItem(id ?? epub.info.id, epub.content);
    this.emit('item-added', epub.info);
    return epub;
  }

  /**
   * @returns the new library item
   */
  public async addFromFileDialog(): Promise<Epub | undefined> {
    const item = await Epub.fromFileDialog();
    if (item) {
      return this.add(item);
    }
  }

  /**
   * @returns the new library item
   */
  public async addFromArrayBuffer(content: ArrayBuffer, id?: string): Promise<Epub> {
    const item = await Epub.fromArrayBuffer(content);
    return this.add(item, id);
  }

  public async remove(id: string): Promise<void> {
    await catalogue.removeItem(id);
    await shelf.removeItem(id);
    this.emit('item-removed', id);
  }

  public async index(): Promise<(BookInfo | null)[]> {
    const keys = await catalogue.keys();
    return Promise.all(keys.map((key) => this.getInfo(key)));
  }

  public async get(id: string): Promise<Epub | null> {
    const info = await this.getInfo(id);
    const content = await shelf.getItem<ArrayBuffer>(id);
    if (info && content) {
      await memory.setItem(LAST_BOOK_ID, id);
      return new Epub(info, content);
    } else {
      return null;
    }
  }

  public async getInfo(id: string): Promise<BookInfo | null> {
    return catalogue.getItem<BookInfo>(id);
  }

  public async getLastBookId(): Promise<string | null> {
    return memory.getItem<string>(LAST_BOOK_ID);
  }

  public async updateInfo(info: BookInfo): Promise<BookInfo> {
    return catalogue.setItem<BookInfo>(info.id, info);
  }
}

export const library = new StatefulLibrary();
