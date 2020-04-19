let binder;
const setupFuncs = new Map();
const sortFuncs = new Map();
const repeaters = new Map();
export const addSetup = (name, setupFn) => {
    setupFuncs.set(name, setupFn);
};
export const addSort = (name, sortFn) => {
    sortFuncs.set(name, sortFn);
    sort(name, sortFn);
};
export const addRow = (name, data) => {
    var _a;
    const whatWhere = repeaters.get(name);
    if (whatWhere == null) {
        return;
    }
    const sorter = sortFuncs.get(name);
    if (sorter) {
        return addAndSort(name, sorter, data, whatWhere);
    }
    const parent = whatWhere.parent;
    const element = whatWhere.element;
    const list = whatWhere.list;
    const newDiv = build(parent, element, name, { list: data, fromStore: true, single: false }, list.length);
    const newList = list.concat(data);
    (_a = element.parentElement) === null || _a === void 0 ? void 0 : _a.append(newDiv);
    repeaters.set(name, { parent, element, list: newList });
};
const done = [];
export const repeaterPlugin = (tools) => {
    binder = tools;
    console.log("** Repeater plugin **");
    return {
        attributes: ["repeater"],
        process: (element, repeaterName) => {
            if (done[repeaterName]) {
                return false;
            }
            done[repeaterName] = true;
            const dataAndSource = getData(repeaterName);
            if (dataAndSource == null) {
                return false;
            }
            const list = dataAndSource.list;
            const parent = element.parentNode;
            if (parent == null) {
                return false;
            }
            parent.removeChild(element);
            const newDiv = build(parent, element, repeaterName, dataAndSource);
            const cloned = element.cloneNode(true);
            const cloneData = { element: cloned, parent, list };
            repeaters.set(repeaterName, cloneData);
            element.replaceWith(newDiv);
            console.log("Repeater replacer... ", name, " ", newDiv, cloneData, element);
            return true;
        }
    };
};
const makeRowID = (name, i) => name + "-" + i;
const removeElement = (elementId, parent) => {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error("Cannot find element?!");
        return;
    }
    parent.removeChild(element);
};
const sort = (name, sortFn) => {
    const whatWhere = repeaters.get(name);
    if (whatWhere == null) {
        return;
    }
    const parent = whatWhere.parent;
    const element = whatWhere.element;
    whatWhere.list.forEach((row, i) => removeElement(makeRowID(name, i), parent));
    const list = whatWhere.list.sort(sortFn);
    const newDiv = build(parent, element, name, { list, fromStore: false, single: false }, 0);
    element.replaceWith(newDiv);
    repeaters.set(name, { parent, element, list });
};
const addAndSort = (name, sortFn, data, repeater) => {
    const newList = repeater.list.concat(data);
    repeater.list = newList;
    sort(name, sortFn);
    return newList;
};
const getData = (name) => {
    const fromStorage = getStorageList(name);
    if (fromStorage != null && fromStorage.length > 0) {
        const single = fromStorage.find(pair => (pair[""] ? true : false));
        console.log("Repeater data obtained from storage");
        return { list: fromStorage, fromStore: true, single };
    }
    const func = setupFuncs.get(name);
    if (func == null) {
        console.warn("Repeater data has no function for -" + name);
        return null;
    }
    console.log("Repeater data obtained from generate function -" + name);
    const generated = func();
    const single = generated.find(row => row instanceof String);
    return { list: generated, fromStore: false, single };
};
const getStorageList = (name) => {
    const allKeys = binder.get(name + "-keys");
    if (allKeys == null) {
        return null;
    }
    const keys = JSON.parse(allKeys.currentValue);
    const rows = keys.length > 0 ? getRows(name, keys, 0) : getKeylessRow(name, 0);
    console.log("Got ", rows.length, " rows from storage");
    return rows;
};
const getKeylessRow = (name, index, rows = []) => {
    const value = binder.get(name + "--" + index);
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
    console.time("build " + name);
    const news = data.list.map((field, i) => buildBlocks(offset, element, field, name, i, !data.fromStore, data.single));
    //  console.timeEnd("build " + name);
    //  console.time("build insert " + name);
    news.forEach((newElement, i) => parent.insertBefore(newElement, element.nextSibling));
    //  console.timeEnd("build insert " + name);
    console.timeEnd("build " + name);
    return element;
};
const buildBlocks = (offset, element, field, name, i, store, single) => {
    /*
    console.log("");
    console.log("");
    console.log("");
    console.log("***********************************");
   */
    // console.time("clone");
    const birth = element.cloneNode(true);
    //    birth.removeAttribute("repeater");
    // console.timeEnd("clone");
    // console.time("id");
    birth.id = makeRowID(name, offset + i);
    // console.timeEnd("id");
    // console.time("findPlace");
    const keys = findPlace(birth, new Set(), offset + i, name, field, store, single);
    // console.timeEnd("findPlace");
    binder.setByName(name + "-keys", JSON.stringify([...keys]));
    //  console.time("setCol");
    //  setColumns(placeHolders, name, field, offset + i);
    //  console.timeEnd("setCol");
    return birth;
};
const getPlace = (element) => {
    if (!element.hasAttribute) {
        return false;
    }
    const place = element.hasAttribute("place");
    return place;
};
const findPlace = (element, result, index, name, data, store, single) => {
    const hasPlace = getPlace(element);
    const placeValue = hasPlace ? element.getAttribute("place") : "";
    const place = placeValue != null ? placeValue : "";
    if (hasPlace) {
        //    console.time("\tpopulatePlaceHolder");
        const key = populatePlaceHolder(element, index, name, data, place, store);
        if (key != null && key.length > 0) {
            result.add(key);
        }
        //    console.timeEnd("\tpopulatePlaceHolder");
    }
    return findPlaceInChildNodes(element.childNodes, result, index, name, data, store, single);
};
const findPlaceInChildNodes = (childNodes, result, index, name, data, store, single) => {
    childNodes.forEach(node => findPlace(node, result, index, name, data, store, single));
    return result;
};
const getValue = (el, index, data, place) => {
    const key = place === undefined ? null : place;
    if (key === "$index") {
        return { data: "" + index, key };
    }
    if (key === null || key === "") {
        return { data: data, key: "" };
    }
    return { data: data[key], key };
};
const setColumns = (placeHolders, name, data, index, place, store) => {
    const keys = new Set();
    placeHolders.forEach((el) => {
        const key = populatePlaceHolder(el, index, name, data, place, store);
        if (key != null && key.length > 0) {
            keys.add(key);
        }
        else {
            keys.add("" + index);
        }
    });
    binder.setByName(name + "-keys", JSON.stringify([...keys]));
};
const populatePlaceHolder = (el, index, name, data, place, store) => {
    //  console.time("\t\tgetValue");
    const value = getValue(el, index, data, place);
    //  console.timeEnd("\t\tgetValue");
    //  console.time("\t\tsetAttribute");
    const key = value.key;
    el.id = name + "-" + key + "-" + index;
    el.setAttribute("name", el.id);
    const keyValue = value.key || "";
    const storeKey = keyValue === "" ? index + "" : keyValue;
    value.key = storeKey;
    //  console.timeEnd("\t\tsetAttribute");
    //el.removeAttribute("place");
    //  console.time("\t\tsetValue");
    //console.log("Repeater DAS... storing "+index+". "+el.id+" :", value.data);
    binder.setValue(el, value.data);
    //  console.timeEnd("\t\tsetValue");
    if (!store) {
        return storeKey;
    }
    //  console.time("\t\tbind");
    binder.put(el);
    //  console.timeEnd("\t\tbind");
    return storeKey;
};
//# sourceMappingURL=repeaterPlugin.js.map