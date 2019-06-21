import { moveAction } from "./swapperMoveSubplugin.js";
// Just for testing....
let storage = window.localStorage;
let doc = document;
const swapped = new Array();
const PREFIX = "swap-parent-id-for-";
const actions = new Array();
const movers = new Array();
export function setStorage(s) {
    storage = s;
}
export function setDocument(d) {
    doc = d;
}
export const actionMover = (dataMove) => movers.push(dataMove);
export const action = (actionF) => actions.push(actionF);
export const swapPlugin = tools => {
    return {
        attributes: ["swap", "swap-action"],
        process: (element) => {
            const pids = getParentIds(element, tools);
            if (!pids) {
                return false;
            }
            registerMover(tools, element);
            storage.setItem(PREFIX + element.id, JSON.stringify(pids));
            tools.clickListener(element, (e) => click(element));
            return true;
        }
    };
};
export const getParentIds = (element, tools) => {
    const pid = sortParentID(element, tools);
    if (!pid) {
        return false;
    }
    const pids = { currentParentID: pid, originParentID: pid };
    const parentIDs = storage.getItem(PREFIX + element.id);
    if (parentIDs) {
        const storedPIDs = JSON.parse(parentIDs);
        checkSwap(element, storedPIDs);
        return storedPIDs;
    }
    return pids;
};
export const checkSwap = (element, pids) => {
    const found = swapped.findIndex(storedPids => pids.originParentID === storedPids.pids.originParentID ||
        pids.currentParentID === storedPids.pids.originParentID ||
        pids.originParentID === storedPids.pids.currentParentID ||
        pids.currentParentID === storedPids.pids.currentParentID);
    if (found === -1) {
        swapped.push({ element, pids });
        return;
    }
    const other = swapped.splice(found, 1);
    click(element);
    click(other[0].element);
};
export const sortParentID = (element, tools) => {
    const parent = element.parentElement;
    if (parent == null) {
        return false;
    }
    const parentWithID = tools.fixID(parent, PREFIX + element.id);
    return parentWithID.id;
};
export const click = (element) => {
    const groupName = element.getAttribute("swap");
    if (groupName == null) {
        clickAction(element);
        return;
    }
    const key = "swapall" + groupName;
    const idSelected = storage.getItem(key);
    if (!idSelected) {
        registerSelection(element, groupName, key);
        return;
    }
    storage.removeItem(key);
    const selectedElement = doc.getElementById(idSelected);
    if (selectedElement == null) {
        console.error(idSelected + " is missing ???!");
        return;
    }
    selectedElement.classList.remove("swap-selected");
    if (idSelected === element.id) {
        console.error("what are you doing swap with itself???!");
        return;
    }
    const selectedParent = selectedElement.parentElement;
    const parent = element.parentElement;
    if (!parent || !selectedParent) {
        return;
    }
    parent.removeChild(element);
    selectedParent.removeChild(selectedElement);
    parent.appendChild(selectedElement);
    selectedParent.appendChild(element);
    storeNewParentID(selectedElement, parent.id);
    storeNewParentID(element, selectedParent.id);
};
export const storeNewParentID = (element, id) => {
    const key = PREFIX + element.id;
    const pidsString = storage.getItem(key);
    if (pidsString == null) {
        return false;
    }
    const pids = JSON.parse(pidsString);
    pids.currentParentID = id;
    if (pids.originParentID === pids.currentParentID) {
        storage.removeItem(key);
    }
    else {
        storage.setItem(key, JSON.stringify(pids));
    }
};
const registerActionSelection = (element, groupName) => {
    element.classList.add("swap-selected");
    storage.setItem("swap-action-" + groupName, element.id);
};
const clickAction = (element) => {
    const groupName = element.getAttribute("swap-action");
    if (groupName == null) {
        console.error("swap action has no group? ", element);
        return;
    }
    doAction(element, groupName);
};
const doAction = (actionElement, groupName) => {
    const actionID = storage.getItem("swap-action-" + groupName);
    const key = "swapall" + groupName;
    const idSelected = storage.getItem(key);
    if (actionID == null && idSelected == null) {
        registerActionSelection(actionElement, groupName);
        return;
    }
    storage.removeItem("swap-action-" + groupName);
    if (idSelected == null) {
        console.log("Nothing selected for action yet");
        return;
    }
    storage.removeItem(key);
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
const getGroupName = (element) => {
    const actionName = element.getAttribute("swap-action");
    if (actionName != null) {
        return false;
    }
    const groupName = element.getAttribute("swap");
    if (groupName == null) {
        return false;
    }
    return groupName;
};
const registerMover = (tools, element) => {
    const groupName = getGroupName(element);
    if (!groupName) {
        return;
        1;
    }
    movers.filter((mover) => mover.group === groupName)
        .forEach((mover) => {
        const creator = moveAction(tools, mover, element.id);
        action(creator);
    });
};
const registerSelection = (element, groupName, key) => {
    element.classList.add("swap-selected");
    storage.setItem(key, element.id);
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
//# sourceMappingURL=swapPlugin.js.map