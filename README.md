# Mini Workspace Explorer

## Overview

A browser-based file manager for a hierarchical workspace of folders and text files. Create,
navigate, search, edit, rename, and delete items, with folders nested to any depth. Everything is
kept in the browser and restored on the next visit, so there is no backend, no account, and no
network call.

## Live deployment

<!-- Replace with the deployed URL before submitting. -->

_Not deployed yet._

## Features

- Sidebar folder tree with arbitrary nesting, expand and collapse, and the selected folder
  highlighted
- Main panel listing the selected folder's contents, with folders and files clearly distinguished
- Clickable breadcrumbs for the current folder's path
- Create folders and text files inside the selected folder
- Rename and delete items, with confirmation before a destructive action
- Recursive delete, which removes everything nested inside a folder
- Light and dark themes, following the operating system by default and remembered when overridden
- Right-click context menu on items, on the folder background, and in the sidebar tree
- List and grid layouts, with small or large icons, remembered between visits
- Banded rows in the details table, so a wide listing stays readable across its width
- Colour-coded folder and document icons, tinted by file type the way a file manager is
- Read-only preview dialog for a file, with editing kept as a separate, deliberate action
- Text editor with explicit save, an unsaved-changes indicator, and a prompt before navigating away
- Workspace-wide search over folder and file names, with case-insensitive partial matching
- Persistence to `localStorage`, restored on the next visit
- Responsive layout, with the sidebar becoming a drawer on small screens

## Technology stack

- React with Vite
- TypeScript in strict mode
- Redux Toolkit and React Redux
- styled-components
- react-icons
- ESLint and Prettier

No other runtime dependency is used. Anything else the project needs, such as the modal, is
written in the codebase.

## Prerequisites

- Node.js 20.19 or newer
- Yarn 1.22 or newer

## Installation

```bash
yarn install
```

## Commands

| Command          | What it does                        |
| ---------------- | ----------------------------------- |
| `yarn dev`       | Start the development server        |
| `yarn build`     | Type check and build for production |
| `yarn preview`   | Serve the production build locally  |
| `yarn typecheck` | Type check without emitting         |
| `yarn lint`      | Run ESLint                          |
| `yarn format`    | Format the project with Prettier    |

## Project structure

```
@types/                  Ambient types, available without an import
src/
  assets/styles/         Theme and global styles
  components/            Shared UI components, one folder per component
    atoms/               Presentational primitives
  containers/            Feature containers that compose a screen
  store/                 Store configuration, the workspace slice, and selectors
  utils/
    constants/           Storage key and the sample workspace
    helpers/             Pure helpers for the tree, validation, and persistence
  App.tsx                Providers and the workspace screen
  main.tsx               Entry point
```

## View options

The folder listing can be shown as a details table or as a grid of tiles, with small or large
icons, chosen from the toolbar above the listing. The table has Name and Type columns and collapses
into stacked cards on a narrow screen, where the column headings are dropped but each row keeps its
type wording. Grid tiles use icon-only action buttons, each with a per-item `aria-label`. Both choices are held in a separate `preferences` slice and stored under
their own key, so a corrupt workspace payload cannot cost the user their layout, or the reverse.

Item icons are tinted: folders in amber, and documents by extension, so `.md`, `.json`, `.csv` and
`.log` each read differently at a glance. An empty file is drawn with a blank page glyph in a muted
tone. Colour is never the only signal: every item shows its type in words as well, written the way
a file manager writes it, such as `TXT file`. Each item carries exactly one icon, and icons are
`aria-hidden` so they are never announced in place of that wording.

## Light and dark

The header offers Light, Dark, and System. System is the default and follows
`prefers-color-scheme`, updating live if the operating system changes while the page is open. An
explicit choice overrides it and is stored alongside the other view preferences.

The two palettes are defined side by side in `src/assets/styles/theme.ts` and share one set of
sizing tokens, so only colour differs between them. Dark is not the light palette inverted:
surfaces are lifted rather than darkened as they come forward, and the icon tones are brightened to
hold their contrast against a dark row. Every colour in the interface, including the modal
backdrop, the menu shadow, and the text on coloured buttons, is a token present in both palettes,
so no component can be left with a colour that only works in one of them. `color-scheme` is set on
the root, which switches the browser's own controls and scrollbars to match.

## Context menu

Right-clicking an item, the listing background, or a folder in the sidebar opens the application's
own menu instead of the browser's. The menu is written in the codebase rather than taken from a
package: it is positioned at the pointer and clamped to the viewport, closes on Escape, on an
outside click, and on scroll or resize, moves focus to its first entry, and supports arrow-key
navigation between entries.

The browser's own menu is suppressed only on those workspace surfaces. It still works in the text
editor, the search field, and the rename dialog, where copy and paste matter.

An item's operations are defined once, in `useItemActions`, and both the row buttons and the
context menu render from that list, so the two cannot offer different things.

## State management

Workspace state lives in a single Redux Toolkit slice, `src/store/workspaceSlice.ts`, and view
preferences in `src/store/preferencesSlice.ts`. It holds
the items, the selected folder, the open file, the editor draft, the expanded folders, the search
query, and the current dialog. Derived values such as the folder's contents, the breadcrumb path,
the search results, and whether the draft is unsaved are computed in `src/store/selectors.ts`
rather than stored, so they cannot drift from the items.

Every move between folders and files is dispatched as a single `navigationRequested` action. That
gives one place to check for an unsaved draft, which is why the prompt cannot be bypassed by
navigating from the tree, the breadcrumbs, a search result, or the folder listing.

## File-system data structure

Items are stored normalised, keyed by id, with the hierarchy expressed through `parentId`:

```ts
type WorkspaceItem =
	| { id: string; name: string; type: 'folder'; parentId: string | null }
	| { id: string; name: string; type: 'file'; parentId: string | null; content: string };
```

Children, paths, and descendants are derived by recursive traversal in
`src/utils/helpers/tree.helpers.ts`. A nested tree would duplicate that hierarchy in two places and
force rename and delete to keep both in step, so the flat map is the single source of truth. Only
the root has `parentId: null`, and it cannot be deleted.

## Persistence

The workspace is written to `localStorage` under a versioned key whenever the items change.
Navigating, searching, or typing an unsaved draft does not trigger a write.

On load the stored payload is validated rather than trusted: every item's shape is checked, every
parent link must point at a folder that exists, and the hierarchy must reach the root, which rules
out cycles. Anything that fails, including unparseable text and an unavailable storage API, is
treated as absent, and the sample workspace is restored instead.

## Search behaviour

Search covers folders and files across the whole workspace at every depth, matching names with a
case-insensitive partial match. Results show whether each hit is a folder or a file along with its
location, and there is a distinct empty state when nothing matches.

There is one way to clear the field: a button inside it, which appears once there is a query, plus
Escape as a shortcut. The browser's own clear control on a search input is suppressed, since two
controls for the same action read as a mistake, and the built-in one is absent in some browsers,
cannot be styled, and is not dependably reachable by keyboard.

Opening a folder result selects that folder. Opening a file result selects the file's parent and
opens the file in the editor. Either way the tree expands along the path so the location is
visible.

## Unsaved-change handling

Saving is explicit. The editor keeps a draft separate from the saved content, and shows
`Unsaved changes` or `All changes saved` in words rather than by colour alone. Any navigation that
would discard a draft opens a prompt offering Save and continue, Discard changes, or Cancel.

## Implementation decisions

- **Duplicate names are compared case-insensitively.** `Notes.txt` and `notes.txt` cannot be
  siblings, while the name is stored with the capitalisation that was typed. Create and rename
  share one validator, so the rule cannot drift between them.
- **Names are trimmed** before validation and before storage, which is what makes a
  whitespace-only name an empty name.
- **Renaming an item to its current name is accepted** as no change rather than reported as a
  duplicate.
- **Where to go after a delete is computed from the ancestors captured before the delete**, since
  a removed item no longer carries its own parent link.
- **Preview and edit are separate actions.** Clicking a file name, or its Preview button, opens a
  read-only dialog; Edit opens the editor in the main panel. Nothing is put into an editable state
  by accident.
- **Every icon is paired with a visible label or an `aria-label`.** Icons come from react-icons and
  are marked `aria-hidden`, so they decorate a control without ever being its only meaning.
- **Folders and files are told apart by an icon, a word, and a colour together**, never by colour
  alone, so the distinction survives without colour vision.
- **Grid tiles use icon-only action buttons** that keep a per-item `aria-label` such as
  `Delete notes.txt`, so the compact layout loses no information for a screen reader.
- **Sorting puts folders before files**, then compares names case-insensitively.

## Known limitations

- Children are found by scanning all items rather than through a child index. That is
  straightforward to read and fast enough for a workspace held in browser storage, but it would
  need an index at a much larger scale.
- The workspace is per-browser. There is no sync across devices or browsers.
- Files hold plain text only. There is no binary-file or upload support.
- Undo is not available; a delete is confirmed but permanent.
