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

let binder: BinderTools;

export const swapPlugin:BinderPlugin = tools => {
  binder = tools;
  return {attributes:["swap"], process:(element: Element):boolean => {
  console.log("SWAP listening ",element);

    tools.clickListener(element, (e:Event) => click(element));
    return true;
  }};
};

export const click = (element:Element) => {
  console.log("SWAP CLICKED");
  const groupName = element.getAttribute("swap");
  const idSelected = storage.getItem("swap-" + groupName);
  if (!idSelected) { 
    console.log("SWAP stored");
    element.classList.add("swap-selected");
    storage.setItem("swap-" + groupName, element.id);
    return;
  }
  storage.removeItem("swap-" + groupName);
  const selectedElement = doc.getElementById(idSelected);
  if (selectedElement == null){
    console.error(idSelected+ " is missing ???!");
    return
  }
  selectedElement.classList.remove("swap-selected");
  if (idSelected === element.id) {
    console.error("what are you doing swap with itself???!");
    return;
  }

  const selectedParent = selectedElement.parentElement;
  const parent = element.parentElement;
  if (!parent || !selectedParent){
    return;
  }

  parent.removeChild(element);
  selectedParent.removeChild(selectedElement);

  parent.appendChild(selectedElement);
  selectedParent.appendChild(element);
};