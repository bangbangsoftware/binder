let binder;
const data = new Map();
export const addData = (name, list) => {
    data.set(name, list);
};
export const repeaterPlugin = (tools) => {
    binder = tools;
    console.log("** Repeater plugin **");
    return {
        attributes: ["repeater"],
        process: (element, repeaterName) => {
            const list = data.get(repeaterName);
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
const getData = (name) => {
    const list = data.get(name);
    if (list != null) {
        return list;
    }
    const fromStorage = getList(name + "-key-", new Array());
    if (fromStorage.length > 0) {
        return fromStorage;
    }
    console.error("No data been defined for '" + name + "' ");
    return null;
};
const getList = (name, list, index = 0) => {
    const value = binder.get(name + "-" + index);
    if (value == null) {
        return list;
    }
    list.push(value.currentValue);
    return this.getList(name, list, index + 1);
};
const build = (parent, element, name, data) => {
    let keys = new Set();
    const news = data.map((bit, i) => {
        const birth = element.cloneNode(true);
        birth.removeAttribute("repeater");
        const placeHolders = findPlace(birth, []);
        const id = name + "-" + i;
        birth.id = id;
        const newKeys = setValues(placeHolders, id, bit, i);
        if (newKeys.size > keys.size) {
            keys = newKeys;
        }
        return birth;
    });
    [...keys].forEach((key, i) => binder.setByName(name + "-key-" + i, key));
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
const setValues = (placeHolders, id, data, i) => {
    const keys = new Set();
    placeHolders.forEach((el, index) => {
        const value = getValue(el, i, data);
        el.id = id + "-" + value.key;
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