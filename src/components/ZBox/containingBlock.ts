/**
 * To find the containing block of an element.
 */
export function getContainingBlock(element: Element) {
  function hasTransformProperties(el: Element) {
    const computedStyle = window.getComputedStyle(el);
    return (
      computedStyle.transform !== "none" ||
      computedStyle.perspective !== "none" ||
      computedStyle.filter !== "none"
    );
  }

  function isRootElement(el: HTMLElement) {
    return el.tagName === "HTML";
  }

  let currentElement = element.parentElement;

  while (currentElement) {
    // 1.
    if (isRootElement(currentElement)) {
      return currentElement;
    }

    // 2.
    const computedStyle = window.getComputedStyle(currentElement);
    if (computedStyle.position !== "static") {
      return currentElement;
    }

    // 3.
    if (hasTransformProperties(currentElement)) {
      return currentElement;
    }

    currentElement = currentElement.parentElement;
  }

  return document.documentElement;
}
