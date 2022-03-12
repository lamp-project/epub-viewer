import { EventEmitter } from 'eventemitter3';
import { Epub, BookInfo } from './Epub';
export declare class StatefulLibrary extends EventEmitter {
    /**
     * @returns the new library item
     */
    add(epub: Epub): Promise<Epub>;
    /**
     * @returns the new library item
     */
    addFromFileDialog(): Promise<Epub>;
    remove(id: string): Promise<void>;
    index(): Promise<BookInfo[]>;
    get(id: string): Promise<Epub>;
    getInfo(id: string): Promise<BookInfo>;
    getLastBookId(): Promise<string>;
    updateInfo(info: BookInfo): Promise<BookInfo>;
}
export declare const library: StatefulLibrary;
