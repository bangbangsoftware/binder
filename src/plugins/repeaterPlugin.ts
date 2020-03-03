import { BinderTools } from "../binderTypes";

let binder: BinderTools;

const setupFuncs = new Map<string,Function>(); 

export const addFunction = (name: string, setupFn: Function) => {
  setupFuncs.set(name, setupFn);
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

const getData = (name: string): Array<any> | null => {
  const fromStorage = getStorageList(name);
  if (fromStorage != null) {
    console.log("Repeater data obtained from storage");
    return fromStorage;
  }

  const func = setupFuncs.get(name);
  if (func == null){
    console.warn("Repeater data has no function for -"+name);
    return null;
  }
  console.log("Repeater data obtained from generate function -"+name);
  const generated = func();
  binder.setByName(name+"-data", JSON.stringify(generated));  

  return generated;
};

const getStorageList = (name: String): Array<any> | null => {
  const mapString = binder.get(name + "-data");
  if (mapString == null){
    return null;
  }
  const data = JSON.parse(mapString.currentValue);
  return data;
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
): { data: string; key: string | null } => {
  const place = el.getAttribute("place");
  const key = (place === undefined)? null : place;
  if (key === "$index") {
    return { data: "" + index, key };
  }
  if (key === null || key === "") {
    return {data, key};
  }
  return { data: data[key], key };
};

const setValues = (
  placeHolders: Array<Element>,
  name: string,
  data: any,
  index: number
) => {
  placeHolders.forEach((el: HTMLElement) => populatePlaceHolder(el,index, name, data));
};

const populatePlaceHolder = (el: HTMLElement, index: number, name: string, data: any) => {
  const value = getValue(el, index, data);
  const key = (value.key == null)? "": value.key+"-";
  el.id = name + "-" + key + index;
  el.setAttribute("name", el.id);
  el.removeAttribute("place");
  binder.setValue(el, value.data);
  binder.put(el);
}

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
