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
const actions = new Array();
export const action = (actionF) => {
    actions.push(actionF);
};
export const swapperPlugin = tools => {
    binder = tools;
    return { attributes: ["swapper", "swapper-action"], process: (element) => {
            tools.clickListener(element, (e) => click(element));
            return true;
        } };
};
const registerSelection = (element, groupName) => {
    element.classList.add("swap-selected");
    storage.setItem("swap-" + groupName, element.id);
    const actionID = storage.getItem("swap-action-" + groupName);
    if (actionID == null) {
        return;
    }
    const actionElement = doc.getElementById(actionID);
    if (actionElement == null) {
        console.error(actionID + " action is missing??");
        return;
    }
    doAction(actionElement, groupName);
};
const registerActionSelection = (element, groupName) => {
    element.classList.add("swap-selected");
    storage.setItem("swap-action-" + groupName, element.id);
};
const clickAction = (element) => {
    const groupName = element.getAttribute("swapper-action");
    if (groupName == null) {
        console.error("swapper action has no group? ", element);
        return;
    }
    doAction(element, groupName);
};
const doAction = (actionElement, groupName) => {
    const actionID = storage.getItem("swap-action-" + groupName);
    const idSelected = storage.getItem("swap-" + groupName);
    if (actionID == null && idSelected == null) {
        registerActionSelection(actionElement, groupName);
        return;
    }
    storage.removeItem("swap-action-" + groupName);
    if (idSelected == null) {
        console.log("Nothing selected for action yet");
        return;
    }
    storage.removeItem("swap-" + groupName);
    actionElement.classList.remove("swap-selected");
    const selected = doc.getElementById(idSelected);
    if (selected == null) {
        console.error(idSelected + " is missing??");
        return;
    }
    selected.classList.remove("swap-selected");
    const action = actions.find(acts => acts.id === actionElement.id);
    if (action == null) {
        console.error("No id action registered for " + actionElement.id);
        return;
    }
    action.callback(selected);
};
export const click = (element) => {
    const groupName = element.getAttribute("swapper");
    if (groupName == null) {
        clickAction(element);
        return;
    }
    const idSelected = storage.getItem("swap-" + groupName);
    if (!idSelected) {
        registerSelection(element, groupName);
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