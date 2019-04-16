import { BinderPlugin, BinderPluginProcessor, RegEntry, BinderTools, BinderPluginLogic } from "./binderTypes";

const namesDone = new Array<string>();
const pluginsDone = new Array<string>();

const isInput = (element: Element) => element.localName === "input";
const hide = (element: HTMLElement) => (element.style.display = "none");
const show = (element: HTMLElement) => (element.style.display = "block");

let storage = window.localStorage;
let doc = document;

let dataKey = "reg";

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

const getName = (element: Element): string =>
  element.getAttribute("name") || "";

export function put(element: HTMLElement):{ [key: string]: RegEntry } {
  const fieldname = getName(element);
  if (fieldname === "") {
    console.error("NO name in element !!!!? ", element);
    return registry;
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
  storage.setItem(dataKey, reg);
  return registry;
}

export function clear() {
  storage.setItem(dataKey, "{}");
  for (const field in registry) delete registry[field];
}

export function bagItAndTagIt(plugs = Array<BinderPlugin>(), key = "reg") {
  dataKey = key;
  hide(<HTMLElement>doc.getElementsByTagName("BODY")[0]);
  for (const field in registry) delete registry[field];
  setup();
  const plugins = plugs.map(setupPlugin => setupPlugin(tools));
  const everything = doc.querySelectorAll("*");
  let results = {};
  everything.forEach((element: HTMLElement) => {
    results = registerAll(element, plugins, results);
  });
  console.log("Detected.....");
  Object.keys(results).forEach(k =>{
    console.log(k+" - "+results[k]);
  })
  console.log(".............");
  show(<HTMLElement>doc.getElementsByTagName("BODY")[0]);

}

// Just for testing....
export const setStorage = s => (storage = s);
export const setDocument = d => (doc = d);

const listeners = new Map<string,Function>();
const clickers = new Map<string,Function>();

const setup = () => {
  console.log("Binder getting data from '"+dataKey+"' in local storage");
  const regString = storage.getItem(dataKey);
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

const registerAll = (element: HTMLElement,
                     plugins = Array<BinderPluginLogic>(), 
                     usage: { [key:string]:number; }):  { [key:string]:number; } => {
  if (element == null) {
    return usage;
  }
  
  const name = register(element, plugins);
  const key = (name)? name: "total";
  const count = usage[key] | 0;
  usage[key] = count + 1;

  for (var i = 0, max = element.childNodes.length; i < max; i++) {
    const node = element.childNodes[i];
    if (node instanceof HTMLElement) {
      return registerAll(node, plugins, usage);
    }
  }
  return usage;
};

export const go = plugs => bagItAndTagIt(plugs);
const tools: BinderTools = { put, get, getValue, setValue, clickListener };

const fixID = (element:HTMLElement, name: string):HTMLElement => {
  if (!element.id || element.id === undefined) {
    element.id = name+"-"+namesDone.length;
    console.error("No id so, generating one", element);
  }
  return element;
}

const hasAttribute = (plug: BinderPluginLogic, element: Element): boolean => {
  const attribute = plug.attributes.find(attr => element.hasAttribute(attr));
  return (attribute !== undefined); 
}

const getPlugin = (plugins: Array<BinderPluginLogic>, element: Element): BinderPluginLogic | undefined =>{
  return plugins.find(plugin => hasAttribute(plugin,element));
}

const register = (element: HTMLElement, plugins = Array<BinderPluginLogic>()):string| null => {
  const name = getName(element);
  if (name) {
    fixID(element, name);
    registerState(element, name);
  }
  const plugin = getPlugin(plugins, element);
  if (plugin != undefined){
    const value = plugin.attributes.map(attr => element.getAttribute(attr))
                                  .find(v => v != undefined) || "";
    const pluginName = (value)? value: plugin.attributes[0];                             
    fixID(element, pluginName);    
    registerPlugin(element,plugin,pluginName);
  }
  return null;
};

const registerPlugin = (element: HTMLElement, plugin: BinderPluginLogic, value: string): boolean =>  {
  if (pluginsDone.some(d => d === element.id)) {
    return false;
  }
  pluginsDone.push(element.id);
  return plugin.process(element, value);
};


const registerState = (element: HTMLElement, fieldname: string): boolean =>  {
  if (namesDone.some(d => d === element.id)) {
    return false;
  }
  namesDone.push(element.id);

  addToRegister(element, fieldname);
  if (isInput(element)) {
    listen(element, e => put(e.target));
  }
  return true;
};

const addToRegister = (element: HTMLElement, fieldname: string) => {
  const data = get(fieldname);
  const elements = data ? data.elements : [];
  elements.push(element);
  const currentValue = data ? data.currentValue : getValue(element);
  setValue(element, currentValue);
  put(element);
};