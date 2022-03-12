import { EpubViewerBase } from './EpubViewerBase';
export declare class EpubViewer extends EpubViewerBase {
    protected input: ArrayBuffer;
    constructor(input: ArrayBuffer);
    initialize(): Promise<void>;
    protected registerEventListeners(): void;
    private listenKeyUpEvents;
    private applyRightEvent;
    private applyLeftEvent;
}
