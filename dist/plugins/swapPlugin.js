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
const swapped = new Array();
const PREFIX = "swap-parent-id-for-";
export const swapPlugin = tools => {
    binder = tools;
    return {
        attributes: ["swap"],
        process: (element) => {
            const groupName = element.getAttribute("swap");
            if (groupName == null) {
                return false;
            }
            const pids = getParentIds(element, tools);
            if (!pids) {
                return false;
            }
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
    const key = "swapall" + groupName;
    const idSelected = storage.getItem(key);
    if (!idSelected) {
        element.classList.add("swap-selected");
        storage.setItem(key, element.id);
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
//# sourceMappingURL=swapPlugin.js.map