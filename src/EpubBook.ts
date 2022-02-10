import Epub, { Book } from 'epubjs';
import { PackagingMetadataObject } from 'epubjs/types/packaging';
import fileDialog from 'file-dialog';

export class EpubBook {
	public readonly metadata: PackagingMetadataObject;
	public readonly cover: Blob;
	public readonly content?: ArrayBuffer;

	public static extractBookCover(book: Book) {
		const { coverPath } = book.packaging;
		if (coverPath) {
			return book.archive.getBlob(book.resolve(coverPath));
		} else {
			return null;
		}
	}

	public static async extractMeta(content: ArrayBuffer) {
		const book = Epub(content);
		await book.loaded.cover;
		const cover = await this.extractBookCover(book);
		const metadata = JSON.parse(JSON.stringify(book.packaging?.metadata));
		book.destroy();
		return { cover, metadata };
	}

	public static async importEpubFromFileDialog(): Promise<EpubBook> {
		const content = await fileDialog({ accept: 'application/epub+zip' }).then(
			(res) => res[0].arrayBuffer(),
		);
		const meta = await this.extractMeta(content);
		return { content, ...meta };
	}
}