import { v4 as uuid } from 'uuid';
import fileDialog from 'file-dialog';
import loadEbpub, { Book } from 'epubjs';
import { PackagingMetadataObject } from 'epubjs/types/packaging';

export interface BookInfo extends PackagingMetadataObject {
	id: string;
}

export abstract class Epub {
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

	public static async getInfofromArrayBuffer(
		content: ArrayBuffer,
	): Promise<BookInfo> {
		const book = loadEbpub(content);
		const cover = await this.extractCover(book);
		const info = {
			...JSON.parse(JSON.stringify(book.packaging?.metadata)),
			cover,
			id: uuid(),
		};
		await book.destroy();
		return info;
	}

	public static async fromFileDialog(): Promise<{
		content: ArrayBuffer;
		info: BookInfo;
	}> {
		const selectedFiles = await fileDialog({ accept: 'application/epub+zip' });
		const content = await selectedFiles.item(0).arrayBuffer();
		const info = await this.getInfofromArrayBuffer(content);
		return {
			content,
			info,
		};
	}
}
