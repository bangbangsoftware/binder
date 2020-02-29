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
                console.error("No data been defined for '" + repeaterName + "' ");
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
const build = (parent, element, name, data) => {
    const news = data.map((bit, i) => {
        const birth = element.cloneNode(true);
        birth.removeAttribute("repeater");
        const placeHolders = findPlace(birth, []);
        const id = name + "-" + i;
        birth.id = id;
        setValues(placeHolders, id, bit, i);
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
        return "" + index;
    }
    return data[key];
};
const setValues = (placeHolders, id, data, i) => {
    placeHolders.forEach((el, index) => {
        const value = getValue(el, i, data);
        el.id = id + "-" + index;
        el.setAttribute("name", el.id);
        el.removeAttribute("place");
        binder.setValue(el, value);
        binder.put(el);
    });
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