import { BinderTools, BinderPlugin } from "../binderTypes";

let binder: BinderTools;

interface Repeater {
  element: Element;
  parent: Node;
  list: Array<any>;
}

interface Data {
  fromStore: boolean;
  single: boolean;
  list: Array<any>;
}

const setupFuncs = new Map<string, Function>();
const sortFuncs = new Map<string, Function>();
const repeaters = new Map<string, Repeater>();

export const addSetup = (name: string, setupFn: Function) => {
  setupFuncs.set(name, setupFn);
};

export const addSort = (name: string, sortFn: Function) => {
  sortFuncs.set(name, sortFn);
  sort(name, sortFn);
};

export const addRow = (name: string, data: Array<any>) => {
  const whatWhere = repeaters.get(name);
  if (whatWhere == null) {
    return;
  }
  const sorter = sortFuncs.get(name);
  if (sorter) {
    return addAndSort(name, sorter, data, whatWhere);
  }
  const parent = whatWhere.parent;
  const element = whatWhere.element;
  const list = whatWhere.list;

  const newDiv = build(
    parent,
    element,
    name,
    { list: data, fromStore: true, single: false },
    list.length
  );
  const newList = list.concat(data);
  element.parentElement?.append(newDiv);
  repeaters.set(name, { parent, element, list: newList });
};

const done = [];

export const repeaterPlugin: BinderPlugin = (tools: BinderTools) => {
  binder = tools;
  console.log("** Repeater plugin **");
  return {
    attributes: ["repeater"],
    process: (
      element: Element,
      repeaterName: string
    ): boolean | Promise<boolean> => {
      if (done[repeaterName]) {
        return false;
      }
      done[repeaterName] = true;
      const dataAndSource = getData(repeaterName);
      if (dataAndSource == null) {
        return false;
      }
      const list = dataAndSource.list;
      const parent = element.parentNode;
      if (parent == null) {
        return false;
      }
      parent.removeChild(element);
      const newDiv = build(parent, element, repeaterName, dataAndSource);
      const cloned = <Element>element.cloneNode(true);
      const cloneData = { element: cloned, parent, list };
      repeaters.set(repeaterName, cloneData);
      element.replaceWith(newDiv);
      console.log(
        "Repeater replacer... ",
        name,
        " ",
        newDiv,
        cloneData,
        element
      );
      return true;
    }
  };
};

const makeRowID = (name: string, i: number): string => name + "-" + i;
const removeElement = (elementId: string, parent: Node) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error("Cannot find element?!");
    return;
  }
  parent.removeChild(element);
};

const sort = (name: string, sortFn) => {
  const whatWhere = repeaters.get(name);
  if (whatWhere == null) {
    return;
  }
  const parent = whatWhere.parent;
  const element = whatWhere.element;
  whatWhere.list.forEach((row, i) => removeElement(makeRowID(name, i), parent));
  const list = whatWhere.list.sort(sortFn);
  const newDiv = build(
    parent,
    element,
    name,
    { list, fromStore: false, single: false },
    0
  );
  element.replaceWith(newDiv);
  repeaters.set(name, { parent, element, list });
};

const addAndSort = (
  name: string,
  sortFn: Function,
  data: Array<any>,
  repeater: Repeater
) => {
  const newList = repeater.list.concat(data);
  repeater.list = newList;
  sort(name, sortFn);
  return newList;
};

const getData = (name: string): Data | null => {
  const fromStorage = getStorageList(name);
  if (fromStorage != null && fromStorage.length > 0) {
    const single = fromStorage.find(pair => (pair[""] ? true : false));
    console.log("Repeater data obtained from storage");
    return { list: fromStorage, fromStore: true, single };
  }

  const func = setupFuncs.get(name);
  if (func == null) {
    console.warn("Repeater data has no function for -" + name);
    return null;
  }
  console.log("Repeater data obtained from generate function -" + name);
  const generated = func();
  const single = generated.find(row => row instanceof String);
  return { list: generated, fromStore: false, single };
};

const getStorageList = (name: String): Array<any> | null => {
  const allKeys = binder.get(name + "-keys");
  if (allKeys == null) {
    return null;
  }
  const keys = JSON.parse(allKeys.currentValue);
  const rows =
    keys.length > 0 ? getRows(name, keys, 0) : getKeylessRow(name, 0);
  console.log("Got ", rows.length, " rows from storage");
  return rows;
};

const getKeylessRow = (name: String, index: number, rows: Array<any> = []) => {
  const value = binder.get(name + "--" + index);
  if (!value) {
    return rows;
  }
  rows.push(value.currentValue);
  return getKeylessRow(name, index + 1, rows);
};

const getRows = (
  name: String,
  keys: Array<string>,
  index: number,
  rows: Array<any> = []
) => {
  const row = {};
  const values = keys
    .map(key => {
      const value = binder.get(name + "-" + key + "-" + index);
      if (!value) {
        return null;
      }
      row[key] = value.currentValue;
      return value.currentValue;
    })
    .filter(what => what != null);
  if (Object.keys(values).length == 0) {
    return rows;
  }
  rows.push(row);
  return getRows(name, keys, index + 1, rows);
};

const build = (
  parent: Node,
  element: Element,
  name: string,
  data: Data,
  offset = 0
): Element => {
  console.time("build " + name);
  const news = data.list.map((field, i) =>
    buildBlocks(offset, element, field, name, i, !data.fromStore, data.single)
  );
  //  console.timeEnd("build " + name);
  //  console.time("build insert " + name);
  news.forEach((newElement, i) =>
    parent.insertBefore(newElement, element.nextSibling)
  );
  //  console.timeEnd("build insert " + name);
  console.timeEnd("build " + name);
  return element;
};

const buildBlocks = (
  offset: number,
  element: Element,
  field: any,
  name: string,
  i: number,
  store: boolean,
  single: boolean
): Element => {
  /*  
  console.log("");
  console.log("");
  console.log("");
  console.log("***********************************");
 */
  // console.time("clone");
  const birth = <Element>element.cloneNode(true);
  //    birth.removeAttribute("repeater");
  // console.timeEnd("clone");

  // console.time("id");
  birth.id = makeRowID(name, offset + i);
  // console.timeEnd("id");

  // console.time("findPlace");
  const keys = findPlace(
    birth,
    new Set<String>(),
    offset + i,
    name,
    field,
    store,
    single
  );
  // console.timeEnd("findPlace");
  binder.setByName(name + "-keys", JSON.stringify([...keys]));

  //  console.time("setCol");
  //  setColumns(placeHolders, name, field, offset + i);
  //  console.timeEnd("setCol");

  return birth;
};

const getPlace = (element: Element): boolean => {
  if (!element.hasAttribute) {
    return false;
  }
  const place = element.hasAttribute("place");
  return place;
};

const findPlace = (
  element: Element,
  result: Set<String>,
  index: number,
  name: string,
  data: any,
  store: boolean,
  single: boolean
): Set<String> => {
  const hasPlace = getPlace(element);
  const placeValue = hasPlace ? element.getAttribute("place") : "";
  const place = placeValue != null ? placeValue : "";
  if (hasPlace) {
    //    console.time("\tpopulatePlaceHolder");
    const key = populatePlaceHolder(
      <HTMLElement>element,
      index,
      name,
      data,
      place,
      store
    );
    if (key != null && key.length > 0) {
      result.add(key);
    }
    //    console.timeEnd("\tpopulatePlaceHolder");
  }
  return findPlaceInChildNodes(
    element.childNodes,
    result,
    index,
    name,
    data,
    store,
    single
  );
};

const findPlaceInChildNodes = (
  childNodes: NodeListOf<ChildNode>,
  result: Set<String>,
  index: number,
  name: string,
  data: any,
  store: boolean,
  single: boolean
): Set<String> => {
  childNodes.forEach(node =>
    findPlace(<Element>node, result, index, name, data, store, single)
  );
  return result;
};

const getValue = (
  el: HTMLElement,
  index: number,
  data: any,
  place: string
): { data: string; key: string | null } => {
  const key = place === undefined ? null : place;
  if (key === "$index") {
    return { data: "" + index, key };
  }
  if (key === null || key === "") {
    return { data: data, key: "" };
  }
  return { data: data[key], key };
};

const setColumns = (
  placeHolders: Array<Element>,
  name: string,
  data: any,
  index: number,
  place: string,
  store: boolean
) => {
  const keys = new Set<String>();
  placeHolders.forEach((el: HTMLElement) => {
    const key = populatePlaceHolder(el, index, name, data, place, store);
    if (key != null && key.length > 0) {
      keys.add(key);
    } else {
      keys.add("" + index);
    }
  });
  binder.setByName(name + "-keys", JSON.stringify([...keys]));
};

const populatePlaceHolder = (
  el: HTMLElement,
  index: number,
  name: string,
  data: any,
  place: string,
  store: boolean
): string => {
  //  console.time("\t\tgetValue");
  const value = getValue(el, index, data, place);
  //  console.timeEnd("\t\tgetValue");
  //  console.time("\t\tsetAttribute");
  const key = value.key;
  el.id = name + "-" + key + "-" + index;
  el.setAttribute("name", el.id);
  const keyValue = value.key || "";
  const storeKey = keyValue === "" ? index + "" : keyValue;
  value.key = storeKey;
  //  console.timeEnd("\t\tsetAttribute");
  //el.removeAttribute("place");
  //  console.time("\t\tsetValue");
  //console.log("Repeater DAS... storing "+index+". "+el.id+" :", value.data);
  binder.setValue(el, value.data);
  //  console.timeEnd("\t\tsetValue");
  if (!store) {
    return storeKey;
  }
  //  console.time("\t\tbind");
  binder.put(el);
  //  console.timeEnd("\t\tbind");
  return storeKey;
};
