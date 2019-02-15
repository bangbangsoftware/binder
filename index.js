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

const registerMap = {};

export function clear() {
  storage.setItem("reg", "");
  for (const field in registerMap) delete registerMap[field];
}

export function reg(ids) {
  if (Object.keys(registerMap).length === 0) {
    setup(storage);
  }

  ids.forEach(id => {
    const element = doc.getElementById(id);
    start(element);
  });
}

export function put(element) {
  const fieldname = element.name;
  const key = getKey(element);
  const newValue = element[key];
  const data = registry.get(fieldname);
  if (!data) {
    const elementsValue = {
      currentValue: element.innerText,
      elements: [element]
    };
    registry.put(fieldname, elementsValue);
    return element.innerText;
  }

  data.elements = data.elements.map(el => {
    el[getKey(el)] = newValue;
    return el;
  });
  const haveitAlready = data.elements.some(el => el.id === element.id);
  if (!haveitAlready) {
    data.elements.push(element);
  }
  data.currentValue = element[key];
  registry.put(fieldname, data);
  return data.currentValue;
}

const isInput = element => element.localName === "input";
const getKey = element => (isInput(element) ? "value" : "innerText");

const start = element => {
  const fieldname = element.name;
  const input = isInput(element);
  const key = getKey(element);
  set(element, fieldname, key);
  if (input) {
    listen(element, e => put(e.target));
  }
};

const set = (element, fieldname, key) => {
  const data = registry.get(fieldname);

  const elements = data ? data.elements : [];
  elements.push(element);
  const currentValue = data ? data.currentValue : element[key];
  element[key] = currentValue;
  const newData = { elements, currentValue };
  registry.put(fieldname, newData);

  return registerMap;
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
  field.addEventListener("oninput", e => changed(e));
};

const none = w => {
  if (w === undefined) {
    return true;
  }
  if (!w) {
    return true;
  }

  if (w === null) {
    return true;
  }
  return false;
};

const setup = () => {
  const regString = storage.getItem("reg");
  const newReg = none(regString) ? [] : JSON.parse(regString);
  for (const field in registerMap) delete registerMap[field];
  for (const field in newReg)
    registerMap[field] = { currentValue: newReg[field], elements: [] };
};

const registry = {
  get: key => registerMap[key],
  put: (key, elementsValue) => {
    registerMap[key] = elementsValue;
    const keyvalue = {};
    Object.keys(registerMap).forEach(key => {
      keyvalue[key] = registerMap[key].currentValue;
    });
    const reg = JSON.stringify(keyvalue);
    storage.setItem("reg", reg);
  }
};
