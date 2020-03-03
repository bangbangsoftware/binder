let binder;
const data = new Map();
export const addData = (name, list) => {
    data.set(name, list);
    binder.setByName(name + "-data", JSON.stringify(data));
};
export const repeaterPlugin = (baseDataFn = () => { }) => (tools) => {
    binder = tools;
    console.log("** Repeater plugin **");
    return {
        attributes: ["repeater"],
        process: (element, repeaterName) => {
            const list = getData(repeaterName, baseDataFn);
            if (list == null) {
                return false;
            }
            const parent = element.parentNode;
            if (parent == null) {
                return false;
            }
            parent.removeChild(element);
            const newDiv = build(parent, element, repeaterName, list);
            element.replaceWith(newDiv);
            element = newDiv;
            return true;
        }
    };
};
const getData = (name, makeData) => {
    const fromStorage = getStorageList(name);
    if (fromStorage != null) {
        return fromStorage;
    }
    const list = data.get(name);
    if (list != null) {
        return list;
    }
    return makeData();
};
const getStorageList = (name) => {
    const mapString = binder.get(name + "-data");
    if (mapString == null) {
        return null;
    }
    const map = JSON.parse(mapString.currentValue);
    return map.get(name);
};
const build = (parent, element, name, data) => {
    const news = data.map((bit, i) => {
        const birth = element.cloneNode(true);
        birth.removeAttribute("repeater");
        const placeHolders = findPlace(birth, []);
        birth.id = name + "-" + i;
        setValues(placeHolders, name, bit, i);
        return birth;
    });
    news.forEach((newElement, i) => parent.insertBefore(newElement, element.nextSibling));
    return element;
};
const getValue = (el, index, data) => {
    const key = el.getAttribute("place");
    if (!key) {
        return data;
    }
    if (key === "$index") {
        return { data: "" + index, key };
    }
    return { data: data[key], key };
};
const setValues = (placeHolders, name, data, index) => {
    const keys = new Set();
    placeHolders.forEach((el) => {
        const value = getValue(el, index, data);
        el.id = name + "-" + value.key + "-" + index;
        keys.add(value.key);
        el.setAttribute("name", el.id);
        el.removeAttribute("place");
        binder.setValue(el, value.data);
        binder.put(el);
    });
    return keys;
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