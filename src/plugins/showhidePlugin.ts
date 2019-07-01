import { BinderPlugin } from "../binderTypes";

// Just for testing....
let doc = document;
export function setDocument(d) {
  doc = d;
}

const elementsGroups = {};
export const showHidePlugin: BinderPlugin = tools => {
  addHide();
  return {
    attributes: ["showhide", "showhide-trigger"],
    process: (element: HTMLElement, name: string): boolean => {
      const groupName = element.getAttribute("showhide");
      if (!groupName) {
        return regTrigger(tools, name, element);
      }
      const list = groupName.split(",");
      list.forEach(name => storeElement(name.trim(), element));
      return true;
    }
  };
};

const regTrigger = (tools,name, element) =>{
  tools.clickListener(element, () => showHideSwap(name), [name]);
  return true;
}

export const showHideSwap = name => {
  const list = elementsGroups[name];
  list.forEach((el: HTMLElement) => swap(el));
}

const storeElement = (groupName: string, element: HTMLElement) => {
  const group = elementsGroups[groupName];
  const list = group === undefined ? [] : group;
  list.push(element);
  elementsGroups[groupName] = list;
};

const addHide = () => {
  var style = doc.createElement("style");
  style.type = "text/css";
  style.innerHTML = ".hide { display: none; } ";
  doc.getElementsByTagName("head")[0].appendChild(style);
};

const swap = (element: HTMLElement) => {
  if (element.classList.contains("hide")) {
    element.classList.remove("hide");
  } else {
    element.classList.add("hide");
  }
};
