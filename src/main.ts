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

    const eventHandler = createKeydownEventHandler(pattern);
    document.addEventListener("keydown", eventHandler, true);
    window.navigation.addEventListener("currententrychange", () => {
      document.removeEventListener("keydown", eventHandler, true);
    });
  });
}

function createKeydownEventHandler(pattern: Pattern) {
  return (event: KeyboardEvent) => {
    if (isEditing()) {
      return;
    }
    if (isModifierKey(event)) {
      return;
    }

    const container = findContainer(event, pattern.container, pattern.link);
    if (!container) {
      return;
    }
    focus(container as HTMLElement, pattern.link);

    // Prevent scrolling.
    event.preventDefault();

    // Prevent keyboard shortcuts provided by website.
    event.stopImmediatePropagation();
  };
}

function findContainer(event: KeyboardEvent, containerSelector: string, linkSelector: string) {
  const direction = detectDirection(event);
  if (!direction) {
    return null;
  }

  const activeContainer = findActiveContainer(containerSelector);
  const candidateContainers = searchContainers(containerSelector, linkSelector);
  if (!activeContainer) {
    return candidateContainers[0];
  }

  const activeContainerRectangle = activeContainer.getBoundingClientRect();
  return candidateContainers.filter((candidateContainer) => {
    if (candidateContainer == activeContainer) {
      return false;
    }

    const candidateContainerRectangle = candidateContainer.getBoundingClientRect();
    switch (direction) {
      case "up":
        return candidateContainerRectangle.bottom < activeContainerRectangle.bottom &&
          candidateContainerRectangle.right >= activeContainerRectangle.left &&
          candidateContainerRectangle.left <= activeContainerRectangle.right;
      case "down":
        return candidateContainerRectangle.top > activeContainerRectangle.top &&
          candidateContainerRectangle.right >= activeContainerRectangle.left &&
          candidateContainerRectangle.left <= activeContainerRectangle.right;
      case "left":
        return candidateContainerRectangle.right < activeContainerRectangle.right &&
          candidateContainerRectangle.bottom >= activeContainerRectangle.top &&
          candidateContainerRectangle.top <= activeContainerRectangle.bottom;
      case "right":
        return candidateContainerRectangle.left > activeContainerRectangle.left &&
          candidateContainerRectangle.bottom >= activeContainerRectangle.top &&
          candidateContainerRectangle.top <= activeContainerRectangle.bottom;
    }
  }).sort(byDistanceFrom(activeContainer))[0];
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
function focus(container: HTMLElement, linkSelector: string) {
  const link = container.querySelector(linkSelector) as HTMLElement | null;
  if (!link) {
    return;
  }
  link.focus();

  container.style.boxShadow = "0 0 0 4px rgb(94, 158, 214, 0.5)";
  link.style.outline = "none";
  const onBlur = () => {
    container.style.boxShadow = "";
    link.style.outline = "";
    link?.removeEventListener("blur", onBlur);
  };
  link.addEventListener("blur", onBlur);
}

function detectDirection(event: KeyboardEvent) {
  return keyMap[event.key];
}

function findActiveContainer(containerSelector: string) {
  return document.activeElement?.closest(containerSelector);
}

function searchContainers(containerSelector: string, linkSelector: string) {
  return Array.from(document.querySelectorAll(containerSelector)).filter((container) => {
    return container.querySelector(linkSelector);
  });
}
