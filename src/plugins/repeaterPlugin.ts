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
      const list = getData(repeaterName);
      if (list == null) {
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

const getData = (name: string): Array<String> | null => {
  const list = data.get(name);
  if (list != null) {
    return list;
  }
  const fromStorage = getStorageList(name);
  if (fromStorage.length > 0) {
    return fromStorage;
  }
  console.error("No data been defined for '" + name + "' ");
  return null;
};

const getStorageList = (name: String): Array<String> => {
  const results = new Array<String>();
  const keys = getList(name + "-key", new Array<String>());
  if (keys.length == 0) {
    return results;
  }
  keys.forEach(key => getList(name + "-" + key, results));
  return results;
};

const getList = (
  name: string,
  list: Array<String>,
  index = 0
): Array<String> => {
  const value = binder.get(name + "-" + index);
  if (value == null || value.currentValue == null) {
    return list;
  }
  list.push(value.currentValue);
  return getList(name, list, index + 1);
};

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
    birth.id = name + "-" + i;
    const newKeys = setValues(placeHolders, name, bit, i);
    if (newKeys.size > keys.size) {
      keys = newKeys;
    }
    return birth;
  });
  [...keys].forEach((key, i) => binder.setByName(name + "-key-" + i, key));
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
  name: string,
  data: any,
  index: number
): Set<String> => {
  const keys = new Set<String>();
  placeHolders.forEach((el: HTMLElement) => {
    const value = getValue(el, index, data);
    el.id = name + "-" + value.key + "-" + index;
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
