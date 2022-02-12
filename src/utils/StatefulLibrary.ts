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
	public async add(epub: Epub): Promise<Epub> {
		await catalogue.setItem(epub.info.id, epub.info);
		await shelf.setItem(epub.info.id, epub.content);
		this.emit('item-added', epub.info);
		return epub;
	}

	/**
	 * @returns the new library item
	 */
	public async addFromFileDialog(): Promise<Epub> {
		return this.add(await Epub.fromFileDialog());
	}

	public async remove(id: string): Promise<void> {
		await catalogue.removeItem(id);
		await shelf.removeItem(id);
		this.emit('item-removed', id);
	}

	public async index(): Promise<BookInfo[]> {
		const keys = await catalogue.keys();
		return Promise.all(keys.map((key) => this.getInfo(key)));
	}

	public async get(id: string): Promise<Epub> {
		const info = await this.getInfo(id);
		const content = await shelf.getItem<ArrayBuffer>(id);
		await memory.setItem(LAST_BOOK_ID, id);
		return new Epub(info, content);
	}

	public async getInfo(id: string): Promise<BookInfo> {
		return catalogue.getItem<BookInfo>(id);
	}

	public async getLastBookId(): Promise<string> {
		return memory.getItem<string>(LAST_BOOK_ID);
	}

	public async updateInfo(info: BookInfo): Promise<BookInfo> {
		return catalogue.setItem<BookInfo>(info.id, info);
	}
}

export const library = new StatefulLibrary();
