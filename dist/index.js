const done = new Array();
const isInput = (element) => element.localName === "input";
const hide = (element) => (element.style.display = "none");
const show = (element) => (element.style.display = "block");
let storage = window.localStorage;
let doc = document;
let plugins = Array();
export const registry = {};
export const get = (key) => registry[key];
export const getValue = (element) => {
    if (isInput(element)) {
        return element.getAttribute("value") || "";
    }
    return element.innerText;
};
export const setValue = (element, value) => {
    if (isInput(element)) {
        element.setAttribute("value", value);
    }
    element.innerText = value;
};
export function put(element) {
    const fieldname = getName(element);
    if (fieldname === "") {
        console.error("NO name in element !!!!? ", element);
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
    storage.setItem("reg", reg);
}
export function clear() {
    storage.setItem("reg", "{}");
    for (const field in registry)
        delete registry[field];
}
export const go = plugs => bagItAndTagIt(plugs);
const tools = { put, get, getValue, setValue };
export function bagItAndTagIt(plugs = Array()) {
    hide(doc.getElementsByTagName("BODY")[0]);
    for (const field in registry)
        delete registry[field];
    setup();
    plugins = plugs;
    doc.querySelectorAll("*").forEach((element) => check(element));
    show(doc.getElementsByTagName("BODY")[0]);
}
// Just for testing....
export const setStorage = s => (storage = s);
export const setDocument = d => (doc = d);
const setup = () => {
    const regString = storage.getItem("reg");
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
const check = (element) => {
    if (element == null) {
        return;
    }
    register(element);
    for (var i = 0, max = element.childNodes.length; i < max; i++) {
        const node = element.childNodes[i];
        if (node instanceof HTMLElement) {
            check(node);
        }
    }
};
const register = (element) => {
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
const start = (element, fieldname) => {
    const input = isInput(element);
    set(element, fieldname);
    if (input) {
        listen(element, e => put(e.target));
    }
};
const getName = (element) => element.getAttribute("name") || "";
const set = (element, fieldname) => {
    const data = get(fieldname);
    const elements = data ? data.elements : [];
    elements.push(element);
    const currentValue = data ? data.currentValue : getValue(element);
    setValue(element, currentValue);
    put(element);
};
const listen = (field, fn) => {
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
//# sourceMappingURL=index.js.map