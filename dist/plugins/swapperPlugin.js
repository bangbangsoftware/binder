// Just for testing....
let storage = window.localStorage;
export function setStorage(s) {
    storage = s;
}
// Just for testing....
let doc = document;
export function setDocument(d) {
    doc = d;
}
let binder;
export const swapperPlugin = tools => {
    binder = tools;
    return { attributes: ["swapper"], process: (element) => {
            tools.clickListener(element, (e) => click(element));
            return true;
        } };
};
export const click = (element) => {
    const groupName = element.getAttribute("swapper");
    const idSelected = storage.getItem("swap-" + groupName);
    if (!idSelected) {
        element.classList.add("swap-selected");
        storage.setItem("swap-" + groupName, element.id);
        return;
    }
    storage.removeItem("swap-" + groupName);
    const selected = doc.getElementById(idSelected);
    if (selected == null) {
        console.error(idSelected + " is missing ???!");
        return;
    }
    selected.classList.remove("swap-selected");
    if (idSelected === element.id) {
        console.error("what are you doing swap with itself???!");
        return;
    }
    const swapValue = binder.getValue(selected) + "";
    const value = binder.getValue(element);
    if (value === swapValue) {
        console.log("Don't swap to itself '" + value + "'");
        return;
    }
    binder.setValue(element, swapValue + "");
    binder.setValue(selected, value + "");
    binder.put(element);
    binder.put(selected);
};
//# sourceMappingURL=swapperPlugin.js.map