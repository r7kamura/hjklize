type Direction = "up" | "down" | "left" | "right";

export type KeyMap = {
  [key: string]: Direction;
};

export type Pattern = {
  url: string;
  container: string;
  link: string;
};
