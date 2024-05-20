import { patterns, Pattern } from "./patterns";

type Direction = "up" | "down" | "left" | "right";

type KeyMap = {
  [key: string]: Direction;
};

const keyMap: KeyMap = {
  "ArrowUp": "up",
  "ArrowDown": "down",
  "ArrowLeft": "left",
  "ArrowRight": "right",
  "k": "up",
  "j": "down",
  "h": "left",
  "l": "right",
};

setupKeydownEventHandler(patterns);
window.navigation.addEventListener("currententrychange", () => {
  setupKeydownEventHandler(patterns);
});

function setupKeydownEventHandler(patterns: Pattern[]) {
  patterns.forEach((pattern) => {
    if (!new RegExp(pattern.url).test(location.href)) {
      return;
    }

    const eventHandler = createKeydownEventHandler(pattern.selector);
    document.addEventListener("keydown", eventHandler, true);
    window.navigation.addEventListener("currententrychange", () => {
      document.removeEventListener("keydown", eventHandler, true);
    });
  });
}

function createKeydownEventHandler(selector: string) {
  return (event: KeyboardEvent) => {
    if (isEditing()) {
      return;
    }
    if (isModifierKey(event)) {
      return;
    }

    const element = findElement(event, selector);
    if (!element) {
      return;
    }
    focus(element as HTMLElement);

    // Prevent scrolling.
    event.preventDefault();

    // Prevent keyboard shortcuts provided by website.
    event.stopImmediatePropagation();
  };
}

function findElement(event: KeyboardEvent, selector: string) {
  const direction = detectDirection(event);
  if (!direction) {
    return null;
  }

  if (!document.activeElement?.matches(selector)) {
    return document.querySelector(selector);
  }

  const activeRectangle = document.activeElement.getBoundingClientRect();
  return Array.from(document.querySelectorAll(selector)).filter((element) => {
    if (element == document.activeElement) {
      return false;
    }

    const elementRectangle = element.getBoundingClientRect();
    switch (direction) {
      case "up":
        return elementRectangle.bottom < activeRectangle.bottom &&
          elementRectangle.right >= activeRectangle.left &&
          elementRectangle.left <= activeRectangle.right;
      case "down":
        return elementRectangle.top > activeRectangle.top &&
          elementRectangle.right >= activeRectangle.left &&
          elementRectangle.left <= activeRectangle.right;
      case "left":
        return elementRectangle.right < activeRectangle.right &&
          elementRectangle.bottom >= activeRectangle.top &&
          elementRectangle.top <= activeRectangle.bottom;
      case "right":
        return elementRectangle.left > activeRectangle.left &&
          elementRectangle.bottom >= activeRectangle.top &&
          elementRectangle.top <= activeRectangle.bottom;
    }
  }).sort(byDistanceFrom(document.activeElement))[0];
}

function byDistanceFrom(baseElement: Element) {
  return (aElement: Element, bElement: Element) => {
    return calculateDistance(aElement, baseElement) - calculateDistance(bElement, baseElement);
  };
}

function calculateDistance(aElement: Element, bElement: Element) {
  const aRectangle = aElement.getBoundingClientRect();
  const bRectangle = bElement.getBoundingClientRect();
  return Math.hypot(
    aRectangle.top - bRectangle.top,
    aRectangle.left - bRectangle.left,
  );
}

function isEditing() {
  return document.activeElement?.tagName == "INPUT" ||
    document.activeElement?.tagName == "TEXTAREA" ||
    (document.activeElement as HTMLElement)?.isContentEditable;
}

function isModifierKey(event: KeyboardEvent) {
  return event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
}

// Immitate the focus effect.
// The default focus ring may not be visible (by bug?)
// and HTMLElement.focus's focusVisible option is not supported for now.
function focus(element: HTMLElement) {
  element.focus();

  element.style.boxShadow = "0 0 0 4px rgb(94, 158, 214, 0.5)";
  element.style.outline = "none";
  const onBlur = () => {
    element.style.boxShadow = "";
    element.style.outline = "";
    element?.removeEventListener("blur", onBlur);
  };
  element.addEventListener("blur", onBlur);
}

function detectDirection(event: KeyboardEvent) {
  return keyMap[event.key];
}
