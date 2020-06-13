import {
  BinderPlugin,
  RegEntry,
  BinderTools,
  BinderPluginLogic,
  ClickFunction,
} from "./binderTypes";

// yuk so much state....
const namesDone = new Array<string>();
const pluginsDone = new Array<string>();
const listeners = new Map<string, Array<Function>>();
const statelisteners = new Map<string, Array<Function>>();
const idClickers = new Map<string, Array<Function>>();

const nameClickers = new Map<String, Array<Function>>();
let plugins = new Array<BinderPluginLogic>();

const hide = (element: HTMLElement) => (element.style.display = "none");
const show = (element: HTMLElement) => (element.style.display = "block");

// Dodgy mutable variables.... maybe need to be put in local storage?  "Yes! I'm not." Cory 2020
let dataKey = "reg";

// More dodgy mutable variables, but used for testing
let storage = window.localStorage;
let doc = document;

// Just for testing....
export const setStorage = (s) => (storage = s);
export const setDocument = (d) => (doc = d);

export interface Usage {
  name: string;
  qty: number;
}

const isInput = (element: Element) =>
  element != null && element.localName != null && element.localName === "input";

export const registry: { [key: string]: RegEntry } = {};
export const get = (key: string): RegEntry => registry[key];
export const getByName = (key: string): string => {
  const regEntry: RegEntry = get(key);
  return regEntry == null ? "" : regEntry.currentValue;
};

export const getValue = (element: HTMLElement): string => {
  if (isInput(element)) {
    const input = <HTMLInputElement>element;
    return input.value;
  }
  return element.innerText;
};

export const setValue = (element: HTMLElement, value: string) => {
  if (element == null) {
    console.error("Cannot set " + value + " as element is null");
    return;
  }

  if (isInput(element)) {
    const input = <HTMLInputElement>element;
    input.value = value;
  }
  element.innerText = value;
  const name = getName(element);
  stateChange(name, value, statelisteners);
};

const stateChange = (
  name: string,
  value: string,
  mapper: Map<string, Array<Function>>
) => {
  const fns = mapper.get(name);
  if (fns == null) {
    //    console.log(name+" has no function");
    //    console.log(mapper);
    return;
  }

  fns.forEach((fn: Function) => fn(value));
};

const stateReact = (e: Event, mapper: Map<string, Array<Function>>) => {
  if (e.target == null) {
    return;
  }
  const element = <HTMLElement>e.target;
  const name = getName(element);
  const value = getValue(element);
  stateChange(name, value, statelisteners);
};

const getName = (element: Element): string => {
  if (element == null) {
    return "";
  }
  return element.getAttribute("name") || "";
};

export const setByName = (fieldname: string, value: string) => {
  const currentData = get(fieldname);
  if (!currentData) {
    console.warn(
      "Setting " +
        value +
        " for " +
        fieldname +
        ", however its not in the mark up."
    );
  }
  const regEntry: RegEntry = {
    currentValue: value,
    elements: [],
  };
  const data = currentData ? currentData : regEntry;
  data.currentValue = value;
  data.elements = data.elements.map((element: HTMLElement) => {
    setValue(element, data.currentValue);
    return element;
  });
  registry[fieldname] = data;
  const keyvalue = {};
  Object.keys(registry).forEach((key) => {
    keyvalue[key] = registry[key].currentValue;
  });
  const reg = JSON.stringify(keyvalue);
  storage.setItem(dataKey, reg);
};

export const addClickFunction = (name: string, fn: ClickFunction) => {
  console.log("Added click for ", name);
  setMap(nameClickers, name, fn);
};

const setMap = (
  map: Map<String, Array<Function>>,
  key: string,
  fn: Function
) => {
  const haveAlready = map.get(key);
  const fns = haveAlready ? haveAlready : [];
  fns.push(fn);
  map.set(key, fns);
};

const generateRunner = (name: string) => (ev: Event) => {
  const fns = nameClickers.get(name);
  if (fns != null) {
    fns.forEach((fn) => fn(ev));
    return;
  }

  console.error("No click function for " + name);
  console.error("Need to add some code like:");
  console.error(
    '%c import { go, tools, addClickFunction } from "./dist/index.js"; ',
    "background: #222; color: #bada55"
  );
  console.error("");
  console.error(
    '%c addClickFunction("' + name + '", (event) => { ',
    "background: #222; color: #bada55"
  );
  console.error(
    '%c       alert("BOOOOM!"); ',
    "background: #222; color: #bada55"
  );
  console.error("%c });", "background: #222; color: #bada55");
};

export const clickPlugin: BinderPluginLogic = {
  attributes: ["click"],
  process: (element: Element, clickFunctionName: string): boolean => {
    console.log(
      "Found click element ",
      element,
      " with function named ",
      clickFunctionName
    );
    if (!clickFunctionName) {
      console.error("No click function name defined ", element);
      return false;
    }
    const runner = generateRunner(clickFunctionName);
    clickListener(element, (ev: Event) => runner(ev));
    return true;
  },
};

export function putElements(
  elements: Array<HTMLElement>,
  values: Array<string>
) {
  elements.forEach((element, index) => {
    try {
      putElement(element, values[index]);
    } catch (error) {
      console.error(error);
    }
  });
  // Store registry
  const keyvalue = {};
  Object.keys(register).forEach((key) => {
    keyvalue[key] = register[key].currentValue;
  });
  const reg = JSON.stringify(keyvalue);
  storage.setItem(dataKey, reg);
}

const putElement = (element: HTMLElement, currentValue = getValue(element)) => {
  const fieldname = getName(element);
  const data = updateEntry(fieldname, element, currentValue);

  // update memory registory
  register[fieldname] = data;
};

const updateEntry = (
  fieldname: string,
  element: HTMLElement,
  currentValue: string
): RegEntry => {
  // get registry entry and update
  const storedEntry = get(fieldname);
  if (!storedEntry) {
    //    setValue(element, currentValue);
    const entry = {
      elements: [element],
      currentValue,
    };
    registry[fieldname] = entry;
    stateChange(fieldname, currentValue, statelisteners);
    return entry;
  }

  storedEntry.currentValue = currentValue;

  // update all elements in entry
  let newEntry = true;
  storedEntry.elements = storedEntry.elements.map(
    (storedElement: HTMLElement) => {
      setValue(storedElement, currentValue);
      if (storedElement.id === element.id) {
        newEntry = false;
      }
      return storedElement;
    }
  );
  if (newEntry) {
    storedEntry.elements.push(element);
  }
  return storedEntry;
};

export function put(element: HTMLElement): { [key: string]: RegEntry } {
  putElement(element);

  // Store registry
  const keyvalue = {};
  Object.keys(register).forEach((key) => {
    keyvalue[key] = register[key].currentValue;
  });
  const reg = JSON.stringify(keyvalue);
  111111111111111;
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
  const everything: NodeListOf<HTMLElement> = doc.querySelectorAll("*");
  plugins = plugs.map((setupPlugin) => setupPlugin(tools));
  plugins.push(clickPlugin);

  const results = registerElements(everything);
  console.log("Detected.....");
  results.forEach((result) => console.log(result.name + " - " + result.qty));
  console.log(".............");
  show(<HTMLElement>doc.getElementsByTagName("BODY")[0]);
}

const registerElements = (
  everything: NodeListOf<HTMLElement>
): Array<Usage> => {
  let results = new Array<Usage>();
  everything.forEach((element: HTMLElement) => {
    results = registerAll(element, results);
  });
  return results;
};

const clickListener = (element: Element, fn: Function) => {
  const changed = (event: Event) => fn(event);
  childIDs(element)
    .filter((id) => !idClickers.has(id))
    .forEach((id) => setMap(idClickers, id, changed));

  console.log("clickers", idClickers);
};

const stateListener = (fieldID: string, fn: Function) => {
  const changed = (e: Event) => fn(e);
  addListener(fieldID, changed, statelisteners);
};

const fixID = (element: HTMLElement, name: string): HTMLElement => {
  if (element.id && element.id !== undefined) {
    return element;
  }
  const noSpace = replaceAll(name, " ", "-");
  const id = replaceAll(noSpace, ",", "-") + "-" + namesDone.length;
  element.id = id;
  const typeText = isInput(element) ? "input" : "None input";
  console.error(
    "No id for " + typeText + " element so, generating one: ",
    element.id
  );
  return element;
};

export const tools: BinderTools = {
  put,
  putElements,
  get,
  getValue,
  setValue,
  setByName,
  getByName,
  clickListener,
  stateListener,
  fixID,
};

export const go = (plugs: Array<BinderPlugin>) => bagItAndTagIt(plugs);

const setup = () => {
  console.log("Binder getting data from '" + dataKey + "' in local storage");
  const regString: string | null = storage.getItem(dataKey);
  setupListener();
  if (!regString) {
    return;
  }
  try {
    const reg = JSON.parse(regString);
    Object.keys(reg).forEach(
      (key) => (registry[key] = { currentValue: reg[key], elements: [] })
    );
  } catch (er) {
    console.error("cannot parse", regString);
    console.error(typeof regString);
    console.error(er);
  }
};

const reactAll = (e: Event, mapper: Map<string, Array<Function>>) => {
  if (e.target == null) {
    return;
  }
  console.log("Reacting to ", e);
  const element = <Element>e.target;
  const id = element.id;
  const fns = mapper.get(id);
  if (fns == null) {
    //    console.log(id+" has no function");
    //    console.log(mapper);
    return;
  }

  fns.forEach((fn: Function) => fn(element));
};

const react = (event: Event, mapper: Map<string, Array<Function>>) => {
  if (event.target == null) {
    return;
  }
  const element = <Element>event.target;
  const id = element.id;
  const clickName = element.getAttribute("click");

  const key = element.id;
  const fns = mapper.get(key);
  if (fns != null) {
    fns.forEach((fn) => fn(event));
    return;
  }
  if (!clickName || clickName.length == 0) {
    console.error("ACTION: " + key + " :: no action for '" + id + "'.");
    //    console.log(mapper);
    //    console.log(element);
    return;
  }
  generateRunner(clickName)(event);
};

const listen = (field: Element, fn: Function) => {
  const changed = (e: Element) => fn(e);
  addListener(field.id, changed);
};

const addListener = (fieldID: string, changed: Function, ears = listeners) => {
  const list = ears.get(fieldID);
  const funcList = list ? list : new Array<Function>();
  funcList.push(changed);
  ears.set(fieldID, funcList);
};

const setupListener = () => {
  doc.addEventListener("change", (e) => reactAll(e, listeners));
  doc.addEventListener("onpaste", (e) => reactAll(e, listeners));
  doc.addEventListener("keyup", (e) => reactAll(e, listeners));
  doc.addEventListener("onin", (e) => reactAll(e, listeners));
  doc.addEventListener("click", (e) => react(e, idClickers));

  doc.addEventListener("statechange", (e) => stateReact(e, statelisteners));
};

const childIDs = (
  element: Element,
  ids = new Array<string>()
): Array<string> => {
  if (element == null) {
    console.error("no element for clicker");
    return ids;
  }

  if (!element.id) {
    console.error("no id, no click listener:: ", element);
  } else if (ids.indexOf(element.id) === -1) {
    //console.log("stored to click "+element.id);
    ids.push(element.id);
  }

  if (!element.childNodes || element.childNodes.length === 0) {
    return ids;
  }

  for (var i = 0, max = element.childNodes.length; i < max; i++) {
    const node = element.childNodes[i];
    if (node instanceof HTMLElement) {
      ids = childIDs(node, ids);
    }
  }
  return ids;
};

const increment = (usage: Array<Usage>, name: string): Array<Usage> => {
  const index = usage.findIndex((use: Usage) => use.name === name);
  if (index === -1) {
    usage.push({ name, qty: 1 });
    return usage;
  }
  const replacement: Usage = { name, qty: usage[index].qty + 1 };
  usage[index] = replacement;
  return usage;
};

const updateUsage = (
  usage: Array<Usage>,
  pluginsForElement: Array<BinderPluginLogic>
): Array<Usage> => {
  if (pluginsForElement.length === 0) {
    increment(usage, "total");
  }
  pluginsForElement.forEach((pi) => {
    const key = pi.attributes[0];
    increment(usage, key);
  });
  return usage;
};

const registerAll = (
  element: HTMLElement,
  usage: Array<Usage>
): Array<Usage> => {
  if (element == null) {
    return usage;
  }

  const pluginsForElement: Array<BinderPluginLogic> = register(element);
  usage = updateUsage(usage, pluginsForElement);

  // recurrsive calls....
  for (var i = 0, max = element.childNodes.length; i < max; i++) {
    const node = element.childNodes[i];
    if (node instanceof HTMLElement) {
      return registerAll(node, usage);
    }
  }
  return usage;
};

const replaceAll = (s: string, rid: string, gain: string) => {
  return s.split(rid).join(gain);
};

const hasAttribute = (plug: BinderPluginLogic, element: Element): boolean => {
  const attribute = plug.attributes.find((attr) => element.hasAttribute(attr));
  return attribute !== undefined;
};

const getPlugins = (
  plugins: Array<BinderPluginLogic>,
  element: Element
): Array<BinderPluginLogic> => {
  return plugins.filter((plugin) => hasAttribute(plugin, element));
};

const register = (element: HTMLElement): Array<BinderPluginLogic> => {
  const name = getName(element);
  if (name) {
    fixID(element, name);
    registerState(element, name);
  }
  const pluginsForElement = getPlugins(plugins, element);
  const pluginsDone = pluginsForElement.filter(async (plugin) => {
    const value =
      plugin.attributes
        .map((attr) => element.getAttribute(attr))
        .find((v) => v != undefined) || "";
    const pluginName = value ? value : plugin.attributes[0];
    fixID(element, pluginName);
    return await registerPlugin(element, plugin, pluginName);
  });

  return pluginsDone;
};

const registerPlugin = (
  element: HTMLElement,
  plugin: BinderPluginLogic,
  value: string
): Promise<boolean> => {
  if (pluginsDone.some((d) => d === element.id + "::" + plugin.attributes[0])) {
    return Promise.resolve(false);
  }
  pluginsDone.push(element.id + "::" + plugin.attributes[0]);
  const used = plugin.process(element, value);
  if (used instanceof Promise) {
    return used;
  }
  return Promise.resolve(used);
};

const registerState = (element: HTMLElement, fieldname: string): boolean => {
  if (namesDone.some((d) => d === element.id)) {
    return false;
  }
  namesDone.push(element.id);

  addToRegister(element, fieldname);
  const inputer = isInput(element);
  if (inputer) {
    listen(element, (e) => put(e));
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
