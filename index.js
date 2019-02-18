let storage = window.localStorage;
let doc = document;

// Just for testing....
export function setStorage(s) {
  storage = s;
}

// Just for testing....
export function setDocument(d) {
  doc = d;
}

const registry = {};
export function clear() {
  storage.setItem("reg", "{}");
  for (const field in registry) delete registry[field];
}

let plugins = [];
const done = [];
export function bagItAndTagIt(plugs) {
  doc.getElementsByTagName("BODY")[0].style.display = "none";
  for (const field in registry) delete registry[field];
  setup();
  plugins = plugs;
  doc.querySelectorAll("*").forEach(element => check(element));
  doc.getElementsByTagName("BODY")[0].style.display = "block";
  
}

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

const getName = element => {
  if (element.name) {
    return element.name;
  }
  if (!element.getAttribute) {
    return false;
  }
  return element.getAttribute("name");
};

const check = element => {
  const name = getName(element);
  if (name && done.indexOf(element.id) === -1) {
    done.push(element.id);
    start(element, name);
    const tools = { put, get, getKey };
    plugins.forEach(setup => {
      const plugin = setup(tools);
      plugin(element);
    });
  }
  for (var i = 0, max = element.childNodes.length; i < max; i++) {
    check(element.childNodes[i]);
  }
};

const isInput = element => element.localName === "input";
export const getKey = element => (isInput(element) ? "value" : "innerText");

const start = (element, fieldname) => {
  const input = isInput(element);
  const key = getKey(element);
  set(element, fieldname, key);
  if (input) {
    listen(element, e => put(e.target));
  }
};

export function put(element) {
  const fieldname = getName(element);
  const key = getKey(element);
  const stored = get(fieldname);
  const data = stored
    ? stored
    : { currentValue: element[key], elements: [element] };
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

export function get(key) {
  return registry[key];
}

const set = (element, fieldname, key) => {
  const data = get(fieldname);

  const elements = data ? data.elements : [];
  elements.push(element);
  const currentValue = data ? data.currentValue : element[key];
  element[key] = currentValue;
  const newData = { elements, currentValue };
  put(element);

  return registry;
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
