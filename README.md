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

Once installed, it's automatically activated on supported websites.

For example, you can navigate Google search results with <kbd>↓</kbd> <kbd>↑</kbd> or <kbd>J</kbd> <kbd>K</kbd> keys, open the link with <kbd>Enter</kbd> key, or open it in a background tab with <kbd>Ctrl+Enter</kbd> key.

## Supported Sites

Other well-known sites are also supported, including Amazon's search results page, YouTube's top page, and several news sites.

This extension is made up of a simple combination of URL patterns and CSS selectors like this:

```ts
const patterns = [
  {
    url: "^https://www.google.com/search\\?",
    selector: "a[jsname='UWckNb']",
  },
  {
    url: "^https://www.youtube.com/$",
    selector: "#video-title-link",
  },
  {
    url: "^https://www.youtube.com/(@|results\\?)",
    selector: "#video-title",
  },
  {
    url: "^https://www.amazon.co.jp/s\\?",
    selector: "h2 a",
  },
  // ...
]
```

See [src/patterns.ts](src/patterns.ts) for the full list of supported sites.

If you would like to support your most frequently accessed sites, please send us a pull request.
