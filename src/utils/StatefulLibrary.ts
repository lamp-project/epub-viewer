import { Book } from 'epubjs';
import localforage from 'localforage';
import { EventEmitter } from 'eventemitter3';
import { Epub, BookInfo } from './Epub';

const LAST_BOOK_ID = 'last-book-id';
const catalogue = localforage.createInstance({ name: 'catalogue' });
const shelf = localforage.createInstance({ name: 'shelf' });
const memory = localforage.createInstance({ name: 'memory' });

export class StatefulLibrary extends EventEmitter {
	/**
	 * @returns id of the new library item
	 */
	public async add(metadata: BookInfo, content: ArrayBuffer): Promise<string> {
		await catalogue.setItem(metadata.id, metadata);
		await shelf.setItem(metadata.id, content);
		this.emit('item-added', metadata);
		return metadata.id;
	}

	/**
	 * @returns id of the new library item
	 */
	public async addFromFileDialog(): Promise<string> {
		const { content, info } = await Epub.fromFileDialog();
		return this.add(info, content);
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

	public async get(id: string): Promise<Book> {
		const content = await shelf.getItem<ArrayBuffer>(id);
		await memory.setItem(LAST_BOOK_ID, id);
		return Epub.load(content);
	}

	public async getInfo(id: string): Promise<BookInfo> {
		return catalogue.getItem<BookInfo>(id);
	}

	public async getLastBookId(): Promise<string> {
		return memory.getItem<string>(LAST_BOOK_ID);
	}
}

export const library = new StatefulLibrary();
