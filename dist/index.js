const namesDone = new Array();
const pluginsDone = new Array();
//https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML
const isInput = (element) => {
    if (element == null || element.localName == null) {
        return false;
    }
    return element.localName === "input";
};
const hide = (element) => (element.style.display = "none");
const show = (element) => (element.style.display = "block");
let storage = window.localStorage;
let doc = document;
let dataKey = "reg";
export const registry = {};
export const get = (key) => registry[key];
export const getValue = (element) => {
    if (isInput(element)) {
        const input = element;
        return input.value;
    }
    return element.innerText;
};
export const setValue = (element, value) => {
    if (element == null) {
        console.log("Cannot set " + value + " as element is null");
        return;
    }
    if (isInput(element)) {
        const input = element;
        input.value = value;
    }
    console.log("setvalue ", element.id, "'" + value + "'");
    element.innerText = value;
    doAll(element, statelisteners);
};
const getName = (element) => {
    if (element == null) {
        return "";
    }
    return element.getAttribute("name") || "";
};
export function put(element) {
    const fieldname = getName(element);
    if (fieldname === "") {
        console.error("NO name in element !!!!? ", element);
        return registry;
    }
    const stored = get(fieldname);
    const regEntry = {
        currentValue: getValue(element),
        elements: [element]
    };
    const data = stored ? stored : regEntry;
    data.currentValue = getValue(element);
    data.elements = data.elements.map((element) => {
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
    for (const field in registry)
        delete registry[field];
}
export function bagItAndTagIt(plugs = Array(), key = "reg") {
    dataKey = key;
    hide(doc.getElementsByTagName("BODY")[0]);
    for (const field in registry)
        delete registry[field];
    setup();
    const plugins = plugs.map(setupPlugin => setupPlugin(tools));
    const everything = doc.querySelectorAll("*");
    let results = new Array();
    everything.forEach((element) => {
        results = registerAll(element, plugins, results);
    });
    console.log("Detected.....");
    results.forEach(result => console.log(result.name + " - " + result.qty));
    console.log(".............");
    show(doc.getElementsByTagName("BODY")[0]);
}
// Just for testing....
export const setStorage = s => (storage = s);
export const setDocument = d => (doc = d);
const listeners = new Map();
const statelisteners = new Map();
const clickers = new Map();
const setup = () => {
    console.log("Binder getting data from '" + dataKey + "' in local storage");
    const regString = storage.getItem(dataKey);
    setupListener();
    if (!regString) {
        return;
    }
    try {
        const reg = JSON.parse(regString);
        Object.keys(reg).forEach(key => (registry[key] = { currentValue: reg[key], elements: [] }));
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
    const element = e.target;
    doAll(element, mapper);
};
const doAll = (element, mapper) => {
    const id = element.id;
    const fns = mapper.get(id);
    if (fns == null) {
        //    console.log("IFP - NULL! "+id);
        //    console.log("IFP - ",mapper);
        return;
    }
    console.log("IFP - calling all listeners for " + id, fns);
    fns.forEach(fn => {
        console.log("IFP - looping " + id, fn, element);
        fn(element);
    });
};
const react = (e, mapper) => {
    if (e.target == null) {
        return;
    }
    const element = e.target;
    const id = element.id;
    const fn = mapper.get(id);
    if (fn != null) {
        fn(e);
    }
};
const listen = (field, fn) => {
    const changed = (e) => fn(e);
    addListener(field.id, changed);
};
const stateListener = (fieldID, fn) => {
    const changed = (e) => fn(e);
    console.log("adding ", fieldID);
    addListener(fieldID, changed, statelisteners);
};
const addListener = (fieldID, changed, ears = listeners) => {
    const list = ears.get(fieldID);
    const funcList = list ? list : new Array();
    funcList.push(changed);
    ears.set(fieldID, funcList);
};
const setupListener = () => {
    doc.addEventListener("change", e => reactAll(e, listeners));
    doc.addEventListener("onpaste", e => reactAll(e, listeners));
    doc.addEventListener("keyup", e => reactAll(e, listeners));
    doc.addEventListener("onin", e => reactAll(e, listeners));
    doc.addEventListener("statechange", e => reactAll(e, statelisteners));
    doc.addEventListener("click", e => react(e, clickers));
};
const childIDs = (element, ids = new Array()) => {
    if (!element.id) {
        console.error("no id, no click listener", element);
    }
    else if (ids.indexOf(element.id) === -1) {
        //console.log("stored to click "+element.id);
        ids.push(element.id);
    }
    if (element.childNodes.length === 0) {
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
const clickListener = (e, fn) => {
    const changed = e => fn(e);
    childIDs(e)
        .filter(id => !clickers.has(id))
        .forEach(id => clickers.set(id, changed));
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
    pluginsForElement.forEach(pi => {
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
export const go = plugs => bagItAndTagIt(plugs);
export const tools = {
    put,
    get,
    getValue,
    setValue,
    clickListener,
    stateListener,
    fixID
};
const replaceAll = (s, rid, gain) => {
    return s.split(rid).join(gain);
};
const hasAttribute = (plug, element) => {
    const attribute = plug.attributes.find(attr => element.hasAttribute(attr));
    return attribute !== undefined;
};
const getPlugins = (plugins, element) => {
    return plugins.filter(plugin => hasAttribute(plugin, element));
};
const register = (element, plugins = Array()) => {
    const name = getName(element);
    if (name) {
        fixID(element, name);
        registerState(element, name);
    }
    const pluginsForElement = getPlugins(plugins, element);
    const pluginsDone = pluginsForElement.filter(plugin => {
        const value = plugin.attributes
            .map(attr => element.getAttribute(attr))
            .find(v => v != undefined) || "";
        const pluginName = value ? value : plugin.attributes[0];
        fixID(element, pluginName);
        return registerPlugin(element, plugin, pluginName);
    });
    return pluginsDone;
};
const registerPlugin = (element, plugin, value) => {
    if (pluginsDone.some(d => d === element.id + "::" + plugin.attributes[0])) {
        return false;
    }
    pluginsDone.push(element.id + "::" + plugin.attributes[0]);
    const used = plugin.process(element, value);
    return used;
};
const registerState = (element, fieldname) => {
    if (namesDone.some(d => d === element.id)) {
        return false;
    }
    namesDone.push(element.id);
    addToRegister(element, fieldname);
    if (isInput(element)) {
        listen(element, e => {
            console.log("OK", e);
            console.log("ok....", e.target);
            put(e);
        });
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