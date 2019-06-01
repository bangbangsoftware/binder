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
export const swapPlugin = tools => {
    binder = tools;
    return {
        attributes: ["swap"],
        process: (element) => {
            console.log("SWAP listening ", element);
            const groupName = element.getAttribute("swap");
            if (groupName == null) {
                return false;
            }
            const pids = getParentIds(element, tools);
            if (!pids) {
                return false;
            }
            // Need to do a shuffle or a post process shuffle???
            storage.setItem("swap-parent-id-for-" + element.id, JSON.stringify(pids));
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
    const parentIDs = storage.getItem("swap-parent-id-for-" + element.id);
    if (parentIDs) {
        const storedPIDs = JSON.parse(parentIDs);
        checkSwap(element, storedPIDs);
        return storedPIDs;
    }
    return pids;
};
export const checkSwap = (element, pids) => {
    const found = swapped.findIndex(storedPids => {
        if (pids.originParentID === storedPids.pids.originParentID
            || pids.currentParentID === storedPids.pids.originParentID) {
            return true;
        }
        if (pids.originParentID === storedPids.pids.currentParentID
            || pids.currentParentID === storedPids.pids.currentParentID) {
            return true;
        }
        return false;
    });
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
    const parentWithID = tools.fixID(parent, "swap-parent-id-for-" + element.id);
    return parentWithID.id;
};
export const click = (element) => {
    console.log("SWAP CLICKED");
    const groupName = element.getAttribute("swap");
    const idSelected = storage.getItem("swapall-" + groupName);
    if (!idSelected) {
        console.log("SWAP stored");
        element.classList.add("swap-selected");
        storage.setItem("swapall-" + groupName, element.id);
        return;
    }
    storage.removeItem("swapall-" + groupName);
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
    const pidsString = storage.getItem("swap-parent-id-for-" + element.id);
    if (pidsString == null) {
        return false;
    }
    const pids = JSON.parse(pidsString);
    pids.currentParentID = id;
    storage.setItem("swap-parent-id-for-" + element.id, JSON.stringify(pids));
};
//# sourceMappingURL=swapPlugin.js.map