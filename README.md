# Statefull Pagniated Epub Viewer

A wrapper around epubjs project.

## Installation

```bash
npm i https://github.com/lamp-project/epub-viewer 
```

## Usage

```typescript
import { StatefulPaginatedEpubViewer } from '@lamp-project/epub-viewer';

const viewer = new StatefulPaginatedEpubViewer(
  id, // will use as key for localStorage state persistent
  content, // Array buffer of the epub file
);

await viewer.initialize();
await viewer.display(targetDom);
```

### Utils

Loading Ebook from file dialog:

```typescript
import { library } from '@lamp-project/epub-viewer';

const bookId = await library.addFromFileDialog();
const book = await library.get(bookId);
```

## Events

### Rendering

* `relocated`: on new page rendered. returns a `RelocatedEventPayload` object.
* `contents`: on new content reached. returns a `ContentEventPayload` object.
* `page-changed`: on page changes. sends a `Pagination` object.

### Pagination

* `pagination-update`: on pagination info update. sends a `PaginationUpdateEventPayload` object.
* `pagination-done`: on pagination finished. sends a `PaginationDoneEventPayload` object.

### Input events

* `swipe:left`: gusture event
* `swipe:right`: gusture event
* `tap`: on tap
* `click-tap`: on tap or click
