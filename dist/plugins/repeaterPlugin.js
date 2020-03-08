let binder;
const setupFuncs = new Map();
const sortFuncs = new Map();
const cloneElements = new Map();
export const addSetup = (name, setupFn) => {
    setupFuncs.set(name, setupFn);
};
export const addSort = (name, sortFn) => {
    sortFuncs.set(name, sortFn);
    sort(name, sortFn);
};
const makeRowID = (name, i) => name + "-" + i;
const removeElement = (elementId, parent) => {
    console.log("Removing element with id '" + elementId + "'.");
    const element = document.getElementById(elementId);
    if (!element) {
        console.error("Cannot find element?!");
        return;
    }
    parent.removeChild(element);
};
const sort = (name, sortFn) => {
    const whatWhere = cloneElements.get(name);
    if (whatWhere == null) {
        return;
    }
    const parent = whatWhere.parent;
    const element = whatWhere.element;
    whatWhere.list.forEach((row, i) => removeElement(makeRowID(name, i), parent));
    const list = whatWhere.list.sort(sortFn);
    const newDiv = build(parent, element, name, list, 0);
    element.replaceWith(newDiv);
    cloneElements.set(name, { parent, element, list });
};
export const addRow = (name, data) => {
    var _a;
    const whatWhere = cloneElements.get(name);
    if (whatWhere == null) {
        return;
    }
    const parent = whatWhere.parent;
    const element = whatWhere.element;
    const list = whatWhere.list;
    const newDiv = build(parent, element, name, data, list.length);
    const newList = list.concat(data);
    (_a = element.parentElement) === null || _a === void 0 ? void 0 : _a.append(newDiv);
    cloneElements.set(name, { parent, element, "list": newList });
};
export const repeaterPlugin = (tools) => {
    binder = tools;
    console.log("** Repeater plugin **");
    return {
        attributes: ["repeater"],
        process: (element, repeaterName) => {
            const list = getData(repeaterName);
            if (list == null) {
                return false;
            }
            const parent = element.parentNode;
            if (parent == null) {
                return false;
            }
            parent.removeChild(element);
            const newDiv = build(parent, element, repeaterName, list);
            const cloned = element.cloneNode(true);
            const cloneData = { element: cloned, parent, list };
            cloneElements.set(repeaterName, cloneData);
            element.replaceWith(newDiv);
            return true;
        }
    };
};
const getData = (name) => {
    const fromStorage = getStorageList(name);
    if (fromStorage != null) {
        console.log("Repeater data obtained from storage");
        return fromStorage;
    }
    const func = setupFuncs.get(name);
    if (func == null) {
        console.warn("Repeater data has no function for -" + name);
        return null;
    }
    console.log("Repeater data obtained from generate function -" + name);
    const generated = func();
    return generated;
};
const getStorageList = (name) => {
    const allKeys = binder.get(name + "-keys");
    if (allKeys == null) {
        return null;
    }
    const keys = JSON.parse(allKeys.currentValue);
    const rows = (keys.length > 0) ? getRows(name, keys, 0) : getKeylessRow(name, 0);
    console.log("Got from storage ", rows);
    return rows;
};
const getKeylessRow = (name, index, rows = []) => {
    const value = binder.get(name + "--" + index);
    console.log("ADDING " + name + "--" + index + " ", value);
    if (!value) {
        return rows;
    }
    rows.push(value.currentValue);
    return getKeylessRow(name, index + 1, rows);
};
const getRows = (name, keys, index, rows = []) => {
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
const build = (parent, element, name, data, offset = 0) => {
    const news = data.map((field, i) => {
        const birth = element.cloneNode(true);
        birth.removeAttribute("repeater");
        const placeHolders = findPlace(birth, []);
        birth.id = makeRowID(name, (offset + i));
        setValues(placeHolders, name, field, (offset + i));
        return birth;
    });
    news.forEach((newElement, i) => parent.insertBefore(newElement, element.nextSibling));
    return element;
};
const getValue = (el, index, data) => {
    const place = el.getAttribute("place");
    const key = place === undefined ? null : place;
    if (key === "$index") {
        return { data: "" + index, key };
    }
    if (key === null || key === "") {
        return { data, key };
    }
    return { data: data[key], key };
};
const setValues = (placeHolders, name, data, index) => {
    const keys = new Set();
    placeHolders.forEach((el) => {
        const key = populatePlaceHolder(el, index, name, data);
        if (key != null && key.length > 0) {
            keys.add(key);
        }
    });
    binder.setByName(name + "-keys", JSON.stringify([...keys]));
};
const populatePlaceHolder = (el, index, name, data) => {
    const value = getValue(el, index, data);
    const key = value.key;
    el.id = name + "-" + key + "-" + index;
    el.setAttribute("name", el.id);
    el.removeAttribute("place");
    binder.setValue(el, value.data);
    binder.put(el);
    return value.key;
};
const findPlaceInChildNodes = (childNodes, result) => {
    childNodes.forEach(node => findPlace(node, result));
    return result;
};
const findPlace = (element, result) => {
    if (element.hasAttribute && element.hasAttribute("place")) {
        result.push(element);
    }
    return findPlaceInChildNodes(element.childNodes, result);
};
//# sourceMappingURL=repeaterPlugin.js.map