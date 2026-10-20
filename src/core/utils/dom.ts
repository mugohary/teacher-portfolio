/**
 * Minimal DOM hyperscript + helpers. Replaces template-string HTML so that
 * user-controlled values are inserted as text nodes (XSS-safe by default).
 */

export type Child = Node | string | number | null | undefined | false;
export type Children = Child | readonly Child[];

const SVG_NS = 'http://www.w3.org/2000/svg';

export interface ElementProps {
  className?: string;
  id?: string;
  text?: string;
  /** Infallible inline styles (CSS property names, e.g. "min-height"). */
  style?: Record<string, string | undefined>;
  dataset?: Record<string, string>;
  /** Anything not covered by the typed props below. */
  attrs?: Record<string, string | number | boolean | null>;
  on?: Partial<Record<keyof HTMLElementEventMap, (event: Event) => void>>;
  /** Common attributes, applied via setAttribute when defined. */
  href?: string;
  src?: string;
  alt?: string;
  title?: string;
  type?: string;
  name?: string;
  value?: string;
  placeholder?: string;
  rel?: string;
  target?: string;
  role?: string;
  rows?: number;
  width?: number | string;
  height?: number | string;
  disabled?: boolean;
  loading?: 'eager' | 'lazy';
}

const DIRECT_PROPS = [
  'href',
  'src',
  'alt',
  'title',
  'type',
  'name',
  'value',
  'placeholder',
  'rel',
  'target',
  'role',
  'rows',
  'width',
  'height',
  'disabled',
  'loading',
] as const;

function appendChild(parent: ParentNode, child: Child): void {
  if (child === null || child === undefined || child === false) return;
  if (typeof child === 'string' || typeof child === 'number') {
    parent.append(document.createTextNode(String(child)));
    return;
  }
  parent.append(child);
}

function appendChildren(parent: ParentNode, children: Children): void {
  if (Array.isArray(children)) {
    for (const child of children as Child[]) appendChild(parent, child);
    return;
  }
  appendChild(parent, children as Child);
}

export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: ElementProps = {},
  children: Children = null,
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);

  if (props.className) el.className = props.className;
  if (props.id) el.id = props.id;
  if (props.text !== undefined) el.textContent = props.text;
  if (props.dataset) {
    for (const [key, value] of Object.entries(props.dataset)) el.dataset[key] = value;
  }
  for (const key of DIRECT_PROPS) {
    const value = props[key];
    if (value === undefined || value === null || value === false) continue;
    el.setAttribute(key, value === true ? '' : String(value));
  }
  if (props.attrs) {
    for (const [key, value] of Object.entries(props.attrs)) {
      if (value === null || value === false) continue;
      el.setAttribute(key, value === true ? '' : String(value));
    }
  }
  if (props.style) {
    for (const [key, value] of Object.entries(props.style)) {
      if (value !== undefined) el.style.setProperty(key, value);
    }
  }
  if (props.on) {
    for (const [event, listener] of Object.entries(props.on)) {
      if (listener) el.addEventListener(event, listener);
    }
  }

  appendChildren(el, children);
  return el;
}

/** Replace a container's entire content with the given nodes. */
export function mount(container: Element, ...nodes: Child[]): void {
  container.replaceChildren();
  appendChildren(container, nodes);
}

/** Query a single element with a hard failure when missing. */
export function mustQuery<T extends Element = HTMLElement>(
  selector: string,
  root: ParentNode = document,
): T {
  const el = root.querySelector<T>(selector);
  if (!el) throw new Error(`Required element not found: ${selector}`);
  return el;
}

/** Create an inline SVG element (icons). */
export function svgElement(
  tag: 'svg' | 'path' | 'circle' | 'line' | 'rect',
  options: { attrs?: Record<string, string>; className?: string } = {},
): SVGElement {
  const el = document.createElementNS(SVG_NS, tag);
  if (options.className) el.setAttribute('class', options.className);
  for (const [key, value] of Object.entries(options.attrs ?? {})) el.setAttribute(key, value);
  return el;
}
