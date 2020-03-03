import { BinderTools } from "../binderTypes";

let binder: BinderTools;

const data: Map<string, Array<any>> = new Map<string, Array<any>>(); 

export const addData = (name: string, list: Array<any>) => {
  data.set(name, list);
  binder.setByName(name+"-data", JSON.stringify(data));
};

export const repeaterPlugin = (baseDataFn: Function = () =>{}) => (tools: BinderTools) => {
  binder = tools;
  console.log("** Repeater plugin **");
  return {
    attributes: ["repeater"],
    process: (element: Element, repeaterName: string): boolean => {
      const list = getData(repeaterName, baseDataFn);
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

const getData = (name: string, makeData: Function): Array<any> | null => {
  const fromStorage = getStorageList(name);
  if (fromStorage != null) {
    return fromStorage;
  }
  const list = data.get(name);
  if (list != null) {
    return list;
  }

  return makeData();
};

const getStorageList = (name: String): Array<any> | null => {
  const mapString = binder.get(name + "-data");
  if (mapString == null){
    return null;
  }
  const map = JSON.parse(mapString.currentValue);
  return map.get(name);
};

const build = (
  parent: Node,
  element: Element,
  name: string,
  data: Array<any>
): Element => {
  const news = data.map((bit, i) => {
    const birth = <Element>element.cloneNode(true);
    birth.removeAttribute("repeater");
    const placeHolders = findPlace(birth, []);
    birth.id = name + "-" + i;
    setValues(placeHolders, name, bit, i);
    return birth;
  });
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
