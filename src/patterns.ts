export type Pattern = {
  url: string;
  selector: string;
};

// Ordered by url in alphabetical order.
export const patterns: Pattern[] = [
  {
    url: "^https://automaton-media.com/$",
    selector: ".td-pb-span8 .td-block-span12 .entry-title a",
  },
  {
    url: "^https://www.amazon.co.jp/s\\?",
    selector: "h2 a",
  },
  {
    url: "^https://www.gamespark.jp/",
    selector: "main .news-list .link",
  },
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
];
