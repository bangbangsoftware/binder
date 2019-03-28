import { BinderPlugin, RegEntry, BinderTools } from "./binderTypes";

const done = new Array<string>();
const isInput = (element: Element) => element.localName === "input";
const hide = (element: HTMLElement) => (element.style.display = "none");
const show = (element: HTMLElement) => (element.style.display = "block");

let storage = window.localStorage;
let doc = document;
let plugins = Array<BinderPlugin>();

export const registry: { [key: string]: RegEntry } = {};
export const get = (key: string): RegEntry => registry[key];
export const getValue = (element: HTMLElement): string => {
  if (isInput(element)) {
    const input = <HTMLInputElement> element;
    return input.value;
  }
  return element.innerText;
};
export const setValue = (element: HTMLElement, value: string) => {
  if (isInput(element)) {
    const input = <HTMLInputElement> element;
    input.value = value;
  }
  element.innerText = value;
};


export function put(element: HTMLElement) {
  
  const fieldname = getName(element);
  if (fieldname === "") {
    console.error("NO name in element !!!!? ", element);
  }
  const stored = get(fieldname);
  const regEntry: RegEntry = {
    currentValue: getValue(element),
    elements: [element]
  };
  const data = stored ? stored : regEntry;
  data.currentValue = getValue(element);
  data.elements = data.elements.map((element: HTMLElement) => {
    setValue(element, data.currentValue);
    return element;
  });
  if (!data.elements.find(e => e.id === element.id)) {
    data.elements.push(element);
  }
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

export function bagItAndTagIt(plugs = Array<BinderPlugin>()) {
  hide(<HTMLElement>doc.getElementsByTagName("BODY")[0]);
  for (const field in registry) delete registry[field];
  setup();
  plugins = plugs;
  doc.querySelectorAll("*").forEach((element: HTMLElement) => registerAll(element));
  show(<HTMLElement>doc.getElementsByTagName("BODY")[0]);
}

// Just for testing....
export const setStorage = s => (storage = s);
export const setDocument = d => (doc = d);

const listeners = new Map<string,Function>();
const clickers = new Map<string,Function>();

const setup = () => {
  const regString = storage.getItem("reg");
  setupListener();
  if (!regString) {
    return;
  }
  try {
    const reg = JSON.parse(regString);
    Object.keys(reg).forEach(
      key => (registry[key] = { currentValue: reg[key], elements: [] })
    );
  } catch (er) {
    console.error("cannot parse", regString);
    console.error(typeof regString);
    console.error(er);
  }
};

const react = (e:Event, mapper:Map<string,Function>)  => {
  if (e.target == null){
    return;
  }
  const element = <Element> e.target;
  const id = element.id;
  const fn = mapper.get(id);
  if (fn != null){
    fn(e);
  }
};

const listen = (field: Element, fn: Function) => {
  const changed = (e:Event) => fn(e);
  listeners.set(field.id,changed);
};

const setupListener = () => {
  doc.addEventListener("change", e => react(e, listeners));
  doc.addEventListener("onpaste", e => react(e, listeners));
  doc.addEventListener("keyup", e => react(e, listeners));
  doc.addEventListener("oninput", e => react(e, listeners));
  doc.addEventListener("click", e => react(e, clickers));
}

const clickListener = (e: Element, fn: Function) => {
  const changed = e => fn(e);
  clickers.set(e.id,changed);
}

const registerAll = (element: HTMLElement) => {
  if (element == null) {
    return;
  }
  
  register(element);
  for (var i = 0, max = element.childNodes.length; i < max; i++) {
    const node = element.childNodes[i];
    if (node instanceof HTMLElement) {
      registerAll(node);
    }
  }
};

export const go = plugs => bagItAndTagIt(plugs);
const tools: BinderTools = { put, get, getValue, setValue, registerAll, clickListener };

const register = (element: HTMLElement) => {
  const name = getName(element);
  if (element.getAttribute("name") === "OVER"){
    console.log(name, "checking ",element);
  }
  if (!name) {
    //console.error("No name so cannot register", element);
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
  if (element.getAttribute("name") === "OVER"){
    console.log("checking.................... ",element);
  }
 
  done.push(element.id);
  start(element, name);

  plugins.forEach(setup => {
    const plugin = setup(tools);
    plugin(element);
  });
};

const start = (element: HTMLElement, fieldname: string) => {
  const input = isInput(element);
  set(element, fieldname);
  if (input) {
    listen(element, e => put(e.target));
  }
};

const getName = (element: Element): string =>
  element.getAttribute("name") || "";

const set = (element: HTMLElement, fieldname: string) => {
  const data = get(fieldname);
  const elements = data ? data.elements : [];
  elements.push(element);
  const currentValue = data ? data.currentValue : getValue(element);
  setValue(element, currentValue);
  put(element);
};