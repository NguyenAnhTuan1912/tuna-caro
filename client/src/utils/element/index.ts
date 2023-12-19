/**
 * Use this function to check if an element is scrollable.
 * @param element 
 * @returns 
 */
function isScrollable<T extends HTMLElement>(element: T) {
  if(!element) return;
  
  let cssStyles = window.getComputedStyle(element);
  let overflowValue = cssStyles.getPropertyValue("overflow");
  let check = element.scrollHeight > element.clientHeight;
  console.log("[isScrollable] Scroll height: ", element.scrollHeight);
  console.log("[isScrollable] Client height: ", element.clientHeight);
  return check && (overflowValue === "scroll" || overflowValue === "auto");
}

export const ElementUtils = {
  isScrollable
};