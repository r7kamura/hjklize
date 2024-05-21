import { Pattern } from "./types";

// Ordered by url in alphabetical order.
export const patterns: Pattern[] = [
  {
    url: "^https://automaton-media.com/$",
    container: ".td-pb-span8 .td-block-span12",
    link: "a",
  },
  {
    url: "^https://news.ycombinator.com/",
    container: ".athing",
    link: ".title a",
  },
  {
    url: "^https://store.steampowered.com/wishlist/id/",
    container: ".wishlist_row",
    link: "a",
  },
  {
    url: "^https://www.4gamer.net/",
    container: ".V2_article_container",
    link: "h2 a",
  },
  {
    url: "^https://www.amazon.co.jp/s\\?",
    container: ".s-result-item:not(:has(.s-result-item))",
    link: "h2 a",
  },
  {
    url: "^https://www.gamespark.jp/",
    container: "main .news-list section",
    link: "a",
  },
  {
    url: "^https://www.google.com/search\\?",
    container: ".MjjYud:not(:has(.cUnQKe)):not(:has(.EyBRub))",
    link: "a[ping]",
  },
  {
    url: "^https://www.youtube.com/$",
    container: "#content",
    link: "#video-title-link",
  },
  {
    url: "^https://www.youtube.com/results\\?",
    container: "ytd-video-renderer",
    link: "#video-title",
  },
  {
    url: "^https://www.youtube.com/@",
    container: "ytd-grid-video-renderer",
    link: "a",
  },
];
