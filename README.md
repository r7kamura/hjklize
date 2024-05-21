# Hjklize

A chrome extension to provide <kbd>←</kbd> <kbd>↓</kbd> <kbd>↑</kbd> <kbd>→</kbd> and <kbd>H</kbd> <kbd>J</kbd> <kbd>K</kbd> <kbd>L</kbd> keyboard shortcuts to major websites.

## Installation

Currently, this extension is not published on Chrome Web Store.

You can install it manually by building the extension and loading it in Chrome.

```bash
npm install
npm run build
```

Then, follow the instructions below to install the extension.

1. Open Chrome and go to `chrome://extensions/`.
2. Enable `Developer mode`.
3. Click on `Load unpacked` and select the `dist` folder.

## Usage

Once installed, it's automatically activated on supported pages.

For example, you can navigate Google search results with <kbd>↓</kbd> <kbd>↑</kbd> or <kbd>J</kbd> <kbd>K</kbd> keys, open the link with <kbd>Enter</kbd> key, or open it in a background tab with <kbd>Ctrl+Enter</kbd> key.

## Supported Pages

This extension is made up of a simple combination of URL regex patterns and CSS selectors. See [src/patterns.ts](src/patterns.ts) for the full list of supported pages.

If you would like to support your most frequently accessed sites, please send us a pull request.
