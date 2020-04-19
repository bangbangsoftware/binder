var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const namesDone = new Array();
const pluginsDone = new Array();
const listeners = new Map();
const statelisteners = new Map();
const clickers = new Map();
const hide = (element) => (element.style.display = "none");
const show = (element) => (element.style.display = "block");
// Dodgy mutable variables.... maybe need to be put in local storage?  "Yes! I'm not." Cory 2020
let mode = "";
let dataKey = "reg";
// More dodgy mutable variables, but used for testing
let storage = window.localStorage;
let doc = document;
// Just for testing....
export const setStorage = (s) => (storage = s);
export const setDocument = (d) => (doc = d);
const isInput = (element) => element != null && element.localName != null && element.localName === "input";
export const registry = {};
export const get = (key) => registry[key];
export const getByName = (key) => {
    const regEntry = get(key);
    return regEntry == null ? "" : regEntry.currentValue;
};
export const getValue = (element) => {
    if (isInput(element)) {
        const input = element;
        return input.value;
    }
    return element.innerText;
};
export const setValue = (element, value) => {
    if (element == null) {
        console.error("Cannot set " + value + " as element is null");
        return;
    }
    if (isInput(element)) {
        const input = element;
        input.value = value;
    }
    element.innerText = value;
    const name = getName(element);
    stateChange(name, value, statelisteners);
};
const stateChange = (name, value, mapper) => {
    const fns = mapper.get(name);
    if (fns == null) {
        //    console.log(name+" has no function");
        //    console.log(mapper);
        return;
    }
    fns.forEach((fn) => fn(value));
};
const stateReact = (e, mapper) => {
    if (e.target == null) {
        return;
    }
    const element = e.target;
    const name = getName(element);
    const value = getValue(element);
    stateChange(name, value, statelisteners);
};
const getName = (element) => {
    if (element == null) {
        return "";
    }
    return element.getAttribute("name") || "";
};
export const setByName = (fieldname, value) => {
    const currentData = get(fieldname);
    if (!currentData) {
        console.warn("Setting " +
            value +
            " for " +
            fieldname +
            ", however its not in the mark up.");
    }
    const regEntry = {
        currentValue: value,
        elements: [],
    };
    const data = currentData ? currentData : regEntry;
    data.currentValue = value;
    data.elements = data.elements.map((element) => {
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
export function putElements(elements, values) {
    elements.forEach((element, index) => {
        try {
            putElement(element, values[index]);
        }
        catch (error) {
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
const putElement = (element, currentValue = getValue(element)) => {
    const fieldname = getName(element);
    const data = updateEntry(fieldname, element, currentValue);
    // update memory registory
    register[fieldname] = data;
};
const updateEntry = (fieldname, element, currentValue) => {
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
    storedEntry.elements = storedEntry.elements.map((storedElement) => {
        setValue(storedElement, currentValue);
        if (storedElement.id === element.id) {
            newEntry = false;
        }
        return storedElement;
    });
    if (newEntry) {
        storedEntry.elements.push(element);
    }
    return storedEntry;
};
export function put(element) {
    putElement(element);
    // Store registry
    const keyvalue = {};
    Object.keys(register).forEach((key) => {
        keyvalue[key] = register[key].currentValue;
    });
    const reg = JSON.stringify(keyvalue);
    storage.setItem(dataKey, reg);
    return registry;
}
export function clear() {
    storage.setItem(dataKey, "{}");
    for (const field in registry)
        delete registry[field];
}
export function bagItAndTagIt(plugs = Array(), key = "reg") {
    dataKey = key;
    hide(doc.getElementsByTagName("BODY")[0]);
    for (const field in registry)
        delete registry[field];
    setup();
    const plugins = plugs.map((setupPlugin) => setupPlugin(tools));
    const everything = doc.querySelectorAll("*");
    let results = new Array();
    everything.forEach((element) => {
        results = registerAll(element, plugins, results);
    });
    console.log("Detected.....");
    results.forEach((result) => console.log(result.name + " - " + result.qty));
    console.log(".............");
    show(doc.getElementsByTagName("BODY")[0]);
}
export const setMode = (newMode) => {
    const oldMode = mode + "";
    mode = newMode;
    return oldMode;
};
export const getMode = () => {
    return mode;
};
const clickListener = (e, fn, modes = []) => {
    const changed = (e) => fn(e);
    childIDs(e)
        .filter((id) => !clickers.has(id))
        .forEach((id) => clickers.set(id, changed));
    modes.forEach((modeInList) => {
        childIDs(e)
            .filter((id) => !clickers.has(modeInList + "-" + id))
            .forEach((id) => clickers.set(modeInList + "-" + id, changed));
    });
    console.log("clickers", clickers);
};
const stateListener = (fieldID, fn) => {
    const changed = (e) => fn(e);
    addListener(fieldID, changed, statelisteners);
};
const fixID = (element, name) => {
    if (element.id && element.id !== undefined) {
        return element;
    }
    const noSpace = replaceAll(name, " ", "-");
    const id = replaceAll(noSpace, ",", "-") + "-" + namesDone.length;
    element.id = id;
    const typeText = isInput(element) ? "input" : "None input";
    console.error("No id for " + typeText + " element so, generating one: ", element.id);
    return element;
};
export const tools = {
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
export const go = (plugs) => bagItAndTagIt(plugs);
const setup = () => {
    console.log("Binder getting data from '" + dataKey + "' in local storage");
    const regString = storage.getItem(dataKey);
    setupListener();
    if (!regString) {
        return;
    }
    try {
        const reg = JSON.parse(regString);
        Object.keys(reg).forEach((key) => (registry[key] = { currentValue: reg[key], elements: [] }));
    }
    catch (er) {
        console.error("cannot parse", regString);
        console.error(typeof regString);
        console.error(er);
    }
};
const reactAll = (e, mapper) => {
    if (e.target == null) {
        return;
    }
    console.log("Reacting to ", e);
    const element = e.target;
    const id = element.id;
    const fns = mapper.get(id);
    if (fns == null) {
        //    console.log(id+" has no function");
        //    console.log(mapper);
        return;
    }
    fns.forEach((fn) => fn(element));
};
const react = (e, mapper) => {
    if (e.target == null) {
        return;
    }
    const element = e.target;
    const id = element.id;
    const key = mode.length === 0 ? element.id : mode + "-" + element.id;
    const fn = mapper.get(key);
    if (fn == null) {
        console.error("ACTION: " +
            key +
            " :: no action for '" +
            id +
            "' in the mode '" +
            mode +
            "'.");
        //    console.log(mapper);
        //    console.log(element);
        return;
    }
    fn(e);
};
const listen = (field, fn) => {
    const changed = (e) => fn(e);
    addListener(field.id, changed);
};
const addListener = (fieldID, changed, ears = listeners) => {
    const list = ears.get(fieldID);
    const funcList = list ? list : new Array();
    funcList.push(changed);
    ears.set(fieldID, funcList);
};
const setupListener = () => {
    doc.addEventListener("change", (e) => reactAll(e, listeners));
    doc.addEventListener("onpaste", (e) => reactAll(e, listeners));
    doc.addEventListener("keyup", (e) => reactAll(e, listeners));
    doc.addEventListener("onin", (e) => reactAll(e, listeners));
    doc.addEventListener("click", (e) => react(e, clickers));
    doc.addEventListener("statechange", (e) => stateReact(e, statelisteners));
};
const childIDs = (element, ids = new Array()) => {
    if (element == null) {
        console.error("no element for clicker");
        return ids;
    }
    if (!element.id) {
        console.error("no id, no click listener:: ", element);
    }
    else if (ids.indexOf(element.id) === -1) {
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
const increment = (usage, name) => {
    const index = usage.findIndex((use) => use.name === name);
    if (index === -1) {
        usage.push({ name, qty: 1 });
        return usage;
    }
    const replacement = { name, qty: usage[index].qty + 1 };
    usage[index] = replacement;
    return usage;
};
const updateUsage = (usage, pluginsForElement) => {
    if (pluginsForElement.length === 0) {
        increment(usage, "total");
    }
    pluginsForElement.forEach((pi) => {
        const key = pi.attributes[0];
        increment(usage, key);
    });
    return usage;
};
const registerAll = (element, plugins = Array(), usage) => {
    if (element == null) {
        return usage;
    }
    const pluginsForElement = register(element, plugins);
    usage = updateUsage(usage, pluginsForElement);
    // recurrsive calls....
    for (var i = 0, max = element.childNodes.length; i < max; i++) {
        const node = element.childNodes[i];
        if (node instanceof HTMLElement) {
            return registerAll(node, plugins, usage);
        }
    }
    return usage;
};
const replaceAll = (s, rid, gain) => {
    return s.split(rid).join(gain);
};
const hasAttribute = (plug, element) => {
    const attribute = plug.attributes.find((attr) => element.hasAttribute(attr));
    return attribute !== undefined;
};
const getPlugins = (plugins, element) => {
    return plugins.filter((plugin) => hasAttribute(plugin, element));
};
const register = (element, plugins = Array()) => {
    const name = getName(element);
    if (name) {
        fixID(element, name);
        registerState(element, name);
    }
    const pluginsForElement = getPlugins(plugins, element);
    const pluginsDone = pluginsForElement.filter((plugin) => __awaiter(void 0, void 0, void 0, function* () {
        const value = plugin.attributes
            .map((attr) => element.getAttribute(attr))
            .find((v) => v != undefined) || "";
        const pluginName = value ? value : plugin.attributes[0];
        fixID(element, pluginName);
        return yield registerPlugin(element, plugin, pluginName);
    }));
    return pluginsDone;
};
const registerPlugin = (element, plugin, value) => {
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
const registerState = (element, fieldname) => {
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
const addToRegister = (element, fieldname) => {
    const data = get(fieldname);
    const elements = data ? data.elements : [];
    elements.push(element);
    const currentValue = data ? data.currentValue : getValue(element);
    setValue(element, currentValue);
    put(element);
};
//# sourceMappingURL=index.js.map