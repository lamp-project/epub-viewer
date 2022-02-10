import EventEmitter from 'eventemitter3';
import { Rendition } from 'epubjs';
import { RenditionOptions, Location } from 'epubjs/types/rendition';
export interface Point2D {
    x: number;
    y: number;
}
export interface TouchEvent {
    start: Point2D;
    end: Point2D;
    moved: boolean;
}
export interface RelocatedEventPayload {
    location: Location;
    chapter?: string;
}
export declare class EpubViewerBase extends EventEmitter {
    protected readonly book: import("epubjs").Book;
    protected element: Element;
    protected rendition: Rendition;
    protected currentLocation: string;
    protected currentChapter: string;
    constructor(book?: import("epubjs").Book);
    destroy(): void;
    get size(): {
        width: number;
        height: number;
    };
    initialize(input: ArrayBuffer): Promise<void>;
    display(element: Element, options?: RenditionOptions, target?: string): Promise<void>;
    goTo(target: string): void;
    protected registerEventListeners(): void;
    protected getChapter(href: string): string;
    protected registerThemes(): void;
    private handleEvent;
    private listenRenditionGestureEvents;
}
