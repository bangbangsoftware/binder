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
  
  return generated;
};

const getStorageList = (name: String): Array<any> | null => {
  const allKeys = binder.get(name+"-keys");
  if (allKeys == null){
    return null;
  }
  const keys = JSON.parse(allKeys.currentValue);
  const rows = getRows(name, keys,0);
  console.log("Got from storage ",rows);
  return rows;
};

const getRows = (name: String, keys: Array<string>, index:number, rows: Array<any> = []) => {
  const row = {};
  const values = keys.map(key => row[key] = binder.get(name+"-"+key+"-"+index));
  if (Object.keys(values).length == 0){
    return rows;
  }
  rows.push(row);
  return getRows(name, keys, index+1, rows);
}

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
  const keys = new Set<String>();
  placeHolders.forEach((el: HTMLElement) => keys.add(populatePlaceHolder(el,index, name, data)));
  binder.setByName(name+"-keys", JSON.stringify(keys));
};

const populatePlaceHolder = (el: HTMLElement, index: number, name: string, data: any) => {
  const value = getValue(el, index, data);
  const key = (value.key == null)? "": value.key+"-";
  el.id = name + "-" + key + index;
  el.setAttribute("name", el.id);
  el.removeAttribute("place");
  binder.setValue(el, value.data);
  binder.put(el);
  return key;
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
