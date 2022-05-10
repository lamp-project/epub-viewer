# Statefull Pagniated Epub Viewer

A wrapper around epubjs project.

## Installation

```bash
npm i "@derock.ir/epubjs-plus"
```

## Usage

```typescript
import {
 library,
 StatefulPaginatedEpubViewer,
} from '@derock.ir/epubjs-plus';

const epub = await library.addFromFileDialog();

const viewer = new StatefulPaginatedEpubViewer(epub);

await viewer.initialize();
await viewer.display(targetDom);
```

## Events

### Rendering

* `relocated`: on new page rendered. returns a `RelocatedEventPayload` object.
* `content`: on new content loaded. returns a `Document` object.
* `render`: on new content rendered. returns a `Document` object.
* `page-changed`: on page changes. sends a `Pagination` object.

### Pagination

* `pagination-update`: on pagination info update. sends a `PaginationUpdateEventPayload` object.
* `pagination-done`: on pagination finished. sends a `PaginationDoneEventPayload` object.

### Input events

* `swipe:left`: gusture event
* `swipe:right`: gusture event
* `tap`: on tap
* `click-tap`: on tap or click

## Boilerplate

<https://github.com/hebertcisco/ts-npm-package-boilerplate>
