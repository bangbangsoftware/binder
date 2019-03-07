import { switchPlugin } from "./plugins/switcherPlugin";
import { togglePlugin } from "./plugins/togglePlugin";
import { BinderPlugin, RegEntry, BinderTools } from "./binderTypes";
export { togglePlugin, switchPlugin };

const isInput = (element: Element) => element.localName === "input";
const getKey = (element: Element) => (isInput(element) ? "value" : "innerText");
const hide = (element: HTMLElement) => (element.style.display = "none");
const show = (element: HTMLElement) => (element.style.display = "block");

let storage = window.localStorage;
let doc = document;
let plugins = Array<BinderPlugin>();

const done = new Array<string>();
const registry: { [key: string]: RegEntry } = {};
export const get = (key: string): RegEntry => registry[key];

const tools: BinderTools = { put, get, getKey };

export function put(element: Element) {
  const fieldname = getName(element);
  if (fieldname === "") {
    console.error("NO name in element !!!!? ", element);
  }
  const key = getKey(element);
  const stored = get(fieldname);
  const regEntry: RegEntry = {
    currentValue: element[key],
    elements: [element]
  };
  const data = stored ? stored : regEntry;
  data.currentValue = element[key];
  data.elements = data.elements.map(element => {
    const elementKey = getKey(element);
    element[elementKey] = data.currentValue;
    return element;
  });
  registry[fieldname] = data;
  const keyvalue = {};
  Object.keys(registry).forEach(key => {
    keyvalue[key] = registry[key].currentValue;
  });
  const reg = JSON.stringify(keyvalue);
  storage.setItem("reg", reg);
}

export function clear() {
  storage.setItem("reg", "{}");
  for (const field in registry) delete registry[field];
}

export const go = (plugs = [togglePlugin, switchPlugin]) =>
  bagItAndTagIt(plugs);

export function bagItAndTagIt(plugs = Array<BinderPlugin>()) {
  hide(<HTMLElement>doc.getElementsByTagName("BODY")[0]);
  for (const field in registry) delete registry[field];
  setup();
  plugins = plugs;
  doc.querySelectorAll("*").forEach(element => check(element));
  show(<HTMLElement>doc.getElementsByTagName("BODY")[0]);
}

// Just for testing....
export const setStorage = s => (storage = s);
export const setDocument = d => (doc = d);

const setup = () => {
  const regString = storage.getItem("reg");
  if (!regString) {
    return;
  }
  const reg = JSON.parse(regString);
  Object.keys(reg).forEach(
    key => (registry[key] = { currentValue: reg[key], elements: [] })
  );
};

const check = (element: Element) => {
  if (element == null) {
    return;
  }
  register(element);
  for (var i = 0, max = element.childNodes.length; i < max; i++) {
    const node = element.childNodes[i];
    if (node instanceof Element) {
      check(node);
    }
  }
};

const register = (element: Element) => {
  const name = getName(element);
  if (!name) {
    return;
  }
  if (!element.id) {
    //console.error("No id so, generating one", element);
    //element.id = name+"-"+Object.keys(registry).length;
    console.error("No id so cannot register", element);
    return;
  }
  if (done.find(d => d === element.id)) {
    return;
  }

  done.push(element.id);
  start(element, name);

  plugins.forEach(setup => {
    const plugin = setup(tools);
    plugin(element);
  });
};

const start = (element: Element, fieldname: string) => {
  const input = isInput(element);
  const key = getKey(element);
  set(element, fieldname, key);
  if (input) {
    listen(element, (e) => put(e.target));
  }
};

const getName = (element: Element): string =>
  element.getAttribute("name") || "";

const set = (element: Element, fieldname: string, key: string) => {
  const data = get(fieldname);

  const elements = data ? data.elements : [];
  elements.push(element);
  const currentValue = data ? data.currentValue : element[key];
  element[key] = currentValue;
  put(element);

  return registry;
};

const listen = (field: Element, fn: Function) => {
  const changed = e => fn(e);
  field.addEventListener("change", e => changed(e));
  //  field.addEventListener("keypress", e => {
  //    if (event.which == 13 || event.keyCode == 13) {
  //      adder(holder, name, id, row, takeBut);
  //    }
  //  });
  field.addEventListener("onpaste", e => changed(e));
  field.addEventListener("keyup", e => changed(e));
  field.addEventListener("oninput", e => changed(e));
};