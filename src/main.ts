import { keyMap } from "./keymap";
import { patterns } from "./patterns";
import { Pattern } from "./types";

setupKeydownEventHandler(patterns);
window.navigation.addEventListener("currententrychange", () => {
  setupKeydownEventHandler(patterns);
});

function setupKeydownEventHandler(patterns: Pattern[]) {
  patterns.forEach((pattern) => {
    if (!new RegExp(pattern.url).test(location.href)) {
      return;
    }

    const eventHandler = createKeydownEventHandler(pattern.container, pattern.link);
    document.addEventListener("keydown", eventHandler, true);
    window.navigation.addEventListener("currententrychange", () => {
      document.removeEventListener("keydown", eventHandler, true);
    });
  });
}

function createKeydownEventHandler(containerSelector: string, linkSelector: string) {
  return (event: KeyboardEvent) => {
    if (isEditing()) {
      return;
    }
    if (isModifierKey(event)) {
      return;
    }

    const container = findContainer(event, containerSelector, linkSelector);
    if (!container) {
      return;
    }
    focus(container as HTMLElement, linkSelector);

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

function focus(container: HTMLElement, linkSelector: string) {
  const link = container.querySelector(linkSelector) as HTMLElement | null;
  if (!link) {
    return;
  }
  link.focus();

  container.scrollIntoView({ block: "center" });

  container.style.outline = "auto";
  link.style.outline = "none";
  const onBlur = () => {
    container.style.outline = "";
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
