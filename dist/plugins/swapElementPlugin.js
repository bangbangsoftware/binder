import { moveAction } from "./swapperMoveSubplugin.js";
// Just for testing....
let storage = window.localStorage;
let doc = document;
const swapped = new Array();
const PREFIX = "swap-element-parent-id-for-";
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
export const swapElementPlugin = (tools) => {
    return {
        attributes: ["swap-element", "swap-element-action"],
        process: (element, groupName) => {
            const pids = getParentIds(element, tools);
            if (!pids) {
                return false;
            }
            const modes = [groupName];
            const modeName = element.getAttribute("swap-element-mode");
            if (modeName != null) {
                modes.push(modeName);
            }
            registerMover(tools, element);
            storage.setItem(PREFIX + element.id, JSON.stringify(pids));
            if (groupName) {
                tools.clickListener(element, (e) => click(element, tools), modes);
            }
            else {
                console.error("SWAP PLUGIN:No group name??! ", element);
            }
            return true;
        },
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
        checkSwap(element, storedPIDs, tools);
        return storedPIDs;
    }
    return pids;
};
export const checkSwap = (element, pids, tools) => {
    const found = swapped.findIndex((storedPids) => pids.originParentID === storedPids.pids.originParentID ||
        pids.currentParentID === storedPids.pids.originParentID ||
        pids.originParentID === storedPids.pids.currentParentID ||
        pids.currentParentID === storedPids.pids.currentParentID);
    if (found === -1) {
        swapped.push({ element, pids });
        return;
    }
    const other = swapped.splice(found, 1);
    click(element, tools);
    click(other[0].element, tools);
};
export const sortParentID = (element, tools) => {
    const parent = element.parentElement;
    if (parent == null) {
        return false;
    }
    const parentWithID = tools.fixID(parent, PREFIX + element.id);
    return parentWithID.id;
};
export const click = (element, tools) => {
    const groupName = element.getAttribute("swap-element");
    if (groupName == null) {
        clickAction(element);
        return;
    }
    const key = "swap-element-all-" + groupName;
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
    selectedElement.classList.remove("swap-element-selected");
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
    element.classList.add("swap-element-selected");
    storage.setItem("swap-element-action-" + groupName, element.id);
};
const clickAction = (element) => {
    const groupName = element.getAttribute("swap-element-action");
    if (groupName == null) {
        console.error("swap action has no group? ", element);
        return;
    }
    doAction(element, groupName);
};
const doAction = (actionElement, groupName) => {
    const actionID = storage.getItem("swap-element-action-" + groupName);
    const key = "swap-element-all-" + groupName;
    const idSelected = storage.getItem(key);
    if (actionID == null && idSelected == null) {
        registerActionSelection(actionElement, groupName);
        return;
    }
    storage.removeItem("swap-element-action-" + groupName);
    if (idSelected == null) {
        console.log("Nothing selected for action yet");
        return;
    }
    storage.removeItem(key);
    actionElement.classList.remove("swap-element-selected");
    const selected = doc.getElementById(idSelected);
    if (selected == null) {
        console.error(idSelected + " is missing??");
        return;
    }
    selected.classList.remove("swap-element-selected");
    const action = actions.find((acts) => acts.id === actionElement.id);
    if (action == null) {
        console.error("No id action registered for " + actionElement.id);
        return;
    }
    action.callback(selected);
};
const getGroupName = (element) => {
    const actionName = element.getAttribute("swap-element-action");
    if (actionName != null) {
        return false;
    }
    const groupName = element.getAttribute("swap-element");
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
    movers
        .filter((mover) => mover.group === groupName)
        .forEach((mover) => {
        const creator = moveAction(tools, mover, element.id);
        action(creator);
    });
};
const registerSelection = (element, groupName, key) => {
    element.classList.add("swap-element-selected");
    storage.setItem(key, element.id);
    const actionID = storage.getItem("swap-element-action-" + groupName);
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
//# sourceMappingURL=swapElementPlugin.js.map