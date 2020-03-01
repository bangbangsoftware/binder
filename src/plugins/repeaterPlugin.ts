import { BinderTools } from "../binderTypes";

let binder: BinderTools;

const data: Map<string, Array<any>> = new Map<string, Array<any>>();

export const addData = (name: string, list: Array<any>) => {
  data.set(name, list);
};

export const repeaterPlugin = (tools: BinderTools) => {
  binder = tools;
  console.log("** Repeater plugin **");
  return {
    attributes: ["repeater"],
    process: (element: Element, repeaterName: string): boolean => {
      const list = data.get(repeaterName);
      if (list == null) {
        console.error("No data been defined for '" + repeaterName + "' ");
        return false;
      }
      const parent = element.parentNode;
      if (parent == null) {
        return false;
      }
      parent.removeChild(element);
      const newDiv = build(parent, element, repeaterName, list);
      element.replaceWith(newDiv);
      element = newDiv;
      return true;
    }
  };
};

const popData = (repeaterName: string) => {};

const build = (
  parent: Node,
  element: Element,
  name: string,
  data: Array<any>
): Element => {
  let keys = new Set<String>();
  const news = data.map((bit, i) => {
    const birth = <Element>element.cloneNode(true);
    birth.removeAttribute("repeater");
    const placeHolders = findPlace(birth, []);
    const id = name + "-" + i;
    birth.id = id;
    const newKeys = setValues(placeHolders, id, bit, i);
    if (newKeys.size > keys.size) {
      keys = newKeys;
    }
    return birth;
  });
  [...keys].forEach((key,i) => binder.setByName(name + "-key-"+i, key));
  news.forEach((newElement, i) =>
    parent.insertBefore(newElement, element.nextSibling)
  );
  return element;
};

const getValue = (
  el: HTMLElement,
  index: number,
  data: any
): { data: string; key: string } => {
  const key = el.getAttribute("place");
  if (!key) {
    return data;
  }
  if (key === "$index") {
    return { data: "" + index, key };
  }
  return { data: data[key], key };
};

const setValues = (
  placeHolders: Array<Element>,
  id: string,
  data: any,
  i: number
): Set<String> => {
  const keys = new Set<String>();
  placeHolders.forEach((el: HTMLElement, index: number) => {
    const value = getValue(el, i, data);
    el.id = id + "-" + value.key;
    keys.add(value.key);
    el.setAttribute("name", el.id);
    el.removeAttribute("place");
    binder.setValue(el, value.data);
    binder.put(el);
  });
  return keys;
};

const findPlaceInChildNodes = (
  childNodes: NodeListOf<ChildNode>,
  result: Array<Element>
): Array<Element> => {
  childNodes.forEach(node => findPlace(<Element>node, result));
  return result;
};

const findPlace = (
  element: Element,
  result: Array<Element>
): Array<Element> => {
  if (element.hasAttribute && element.hasAttribute("place")) {
    result.push(element);
  }
  return findPlaceInChildNodes(element.childNodes, result);
};
