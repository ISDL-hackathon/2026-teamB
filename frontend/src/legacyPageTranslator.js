import i18n from "./i18n";
import { translateLegacyText } from "./pageTranslations";

const originals = new WeakMap();
const attributes = ["placeholder", "aria-label", "alt", "title"];

function isI18nextManaged(node) {
  const element = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
  return element?.closest("[data-i18n-managed]") != null;
}

function updateTextNode(node, english) {
  if (isI18nextManaged(node)) return;
  if (/[ぁ-んァ-ヶ一-龯]/u.test(node.nodeValue || "")) originals.set(node, node.nodeValue);
  const original = originals.get(node);
  const next = original == null ? null : (english ? translateLegacyText(original) : original);
  if (next != null && node.nodeValue !== next) node.nodeValue = next;
}

function updateElement(element, english) {
  if (isI18nextManaged(element)) return;
  for (const name of attributes) {
    if (!element.hasAttribute?.(name)) continue;
    const key = `data-i18n-original-${name}`;
    if (!element.hasAttribute(key) && /[ぁ-んァ-ヶ一-龯]/u.test(element.getAttribute(name) || "")) element.setAttribute(key, element.getAttribute(name));
    const original = element.getAttribute(key);
    const next = original == null ? null : (english ? translateLegacyText(original) : original);
    if (next != null && element.getAttribute(name) !== next) element.setAttribute(name, next);
  }
}

function translateTree(root = document.body) {
  if (!root) return;
  const english = i18n.language === "en";
  if (root.nodeType === Node.TEXT_NODE) updateTextNode(root, english);
  if (root.nodeType === Node.ELEMENT_NODE) updateElement(root, english);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) node.nodeType === Node.TEXT_NODE ? updateTextNode(node, english) : updateElement(node, english);
}

let queued = false;
function queueTranslation() {
  if (queued) return;
  queued = true;
  queueMicrotask(() => { queued = false; translateTree(); });
}

const observer = new MutationObserver(queueTranslation);
observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: attributes });
i18n.on("languageChanged", queueTranslation);
queueTranslation();
