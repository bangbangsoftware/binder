import { BinderPlugin, BinderTools } from "../binderTypes";

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

export interface Pids {
  currentParentID: string;
  originParentID: string;
}

export interface Swapped {
  pids: Pids,
  element: Element
}

let binder: BinderTools;
const swapped = new Array<Swapped>();

export const swapPlugin: BinderPlugin = tools => {
  binder = tools;
  return {
    attributes: ["swap"],
    process: (element: Element): boolean => {
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
      tools.clickListener(element, (e: Event) => click(element));
      return true;
    }
  };
};

export const getParentIds = (
  element: Element,
  tools: BinderTools
): Pids | false => {
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

export const checkSwap = (element: Element, pids: Pids) =>{
  const found = swapped.findIndex(storedPids => {
    if (pids.originParentID === storedPids.pids.originParentID
    ||  pids.currentParentID === storedPids.pids.originParentID){
      return true;
    }
    if (pids.originParentID === storedPids.pids.currentParentID
    ||  pids.currentParentID === storedPids.pids.currentParentID){
        return true;
    }
    return false;
  });
  if (found === -1){
    swapped.push({element,pids});
    return;
  }
  const other= swapped.splice(found,1); 
  click(element);
  click(other[0].element);

}

export const sortParentID = (
  element: Element,
  tools: BinderTools
): string | false => {
  const parent = element.parentElement;
  if (parent == null) {
    return false;
  }
  const parentWithID = tools.fixID(parent, "swap-parent-id-for-" + element.id);
  return parentWithID.id;
};

export const click = (element: Element) => {
  const groupName = element.getAttribute("swap");
  const idSelected = storage.getItem("swapall-" + groupName);
  if (!idSelected) {
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

export const storeNewParentID = (element: Element, id: string) => {
  const pidsString = storage.getItem("swap-parent-id-for-" + element.id);
  if (pidsString == null){
    return false;
  }
  const pids:Pids = JSON.parse(pidsString);
  pids.currentParentID = id;
  storage.setItem("swap-parent-id-for-" + element.id, JSON.stringify(pids));
}