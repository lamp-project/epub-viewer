import localforage from "localforage";
import { EventEmitter } from "eventemitter3";
import { Epub } from "./Epub";
const LAST_BOOK_ID = "last-book-id";
const catalogue = localforage.createInstance({ name: "catalogue" });
const shelf = localforage.createInstance({ name: "shelf" });
const memory = localforage.createInstance({ name: "memory" });
export class StatefulLibrary extends EventEmitter {
  async add(epub) {
    await catalogue.setItem(epub.info.id, epub.info);
    await shelf.setItem(epub.info.id, epub.content);
    this.emit("item-added", epub.info);
    return epub;
  }
  async addFromFileDialog() {
    return this.add(await Epub.fromFileDialog());
  }
  async remove(id) {
    await catalogue.removeItem(id);
    await shelf.removeItem(id);
    this.emit("item-removed", id);
  }
  async index() {
    const keys = await catalogue.keys();
    return Promise.all(keys.map((key) => this.getInfo(key)));
  }
  async get(id) {
    const info = await this.getInfo(id);
    const content = await shelf.getItem(id);
    await memory.setItem(LAST_BOOK_ID, id);
    return new Epub(info, content);
  }
  async getInfo(id) {
    return catalogue.getItem(id);
  }
  async getLastBookId() {
    return memory.getItem(LAST_BOOK_ID);
  }
  async updateInfo(info) {
    return catalogue.setItem(info.id, info);
  }
}
export const library = new StatefulLibrary();
//# sourceMappingURL=StatefulLibrary.js.map
