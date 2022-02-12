import Epub, { Book } from 'epubjs';
import { PackagingMetadataObject } from 'epubjs/types/packaging';
import fileDialog from 'file-dialog';

export class EpubBookMetadata implements PackagingMetadataObject {
	public readonly title: string;
	public readonly creator: string;
	public readonly description: string;
	public readonly pubdate: string;
	public readonly publisher: string;
	public readonly identifier: string;
	public readonly language: string;
	public readonly rights: string;
	public readonly modified_date: string;
	public readonly layout: string;
	public readonly orientation: string;
	public readonly flow: string;
	public readonly viewport: string;
	public readonly spread: string;
	public readonly cover: Blob;

	public static async extractCover(book: Book) {
		await book.loaded.cover;
		const { coverPath } = book.packaging;
		if (coverPath) {
			return book.archive.getBlob(book.resolve(coverPath));
		} else {
			return null;
		}
	}

	public static async fromArrayBuffer(
		content: ArrayBuffer,
	): Promise<EpubBookMetadata> {
		const book = Epub(content);
		const cover = await this.extractCover(book);
		const metadata = JSON.parse(JSON.stringify(book.packaging?.metadata));
		await book.destroy();
		return {
			...metadata,
			cover,
		};
	}

	public static async fromFileDialog(): Promise<{
		content: ArrayBuffer;
		metadata: EpubBookMetadata;
	}> {
		const selectedFiles = await fileDialog({ accept: 'application/epub+zip' });
		const content = await selectedFiles.item(0).arrayBuffer();
		const metadata = await this.fromArrayBuffer(content);
		return {
			content,
			metadata,
		};
	}
}
