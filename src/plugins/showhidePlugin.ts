import { BinderPlugin } from "../binderTypes";

// Just for testing....
let doc = document;
export function setDocument(d) {
  doc = d;
}

const elementsGroups = {};
export const showHidePlugin: BinderPlugin = () => {
  addHide();
  return (element: HTMLElement) => {
    const groupName = element.getAttribute("showhide");
    if (groupName) {
      storeElement(groupName, element);
      return;
    }
    const name = element.getAttribute("showhide-trigger");
    if (!name) {
      return;
    }
    element.addEventListener("click", () => {
      console.log("BOOM");
      const list = elementsGroups[name];
      console.log(list);
      list.forEach(element => swap(element));
    });
  };
};

const storeElement = (groupName: string, element: HTMLElement) => {
  const group = elementsGroups[groupName];
  const list = group === undefined ? [] : group;
  list.push(element);
  elementsGroups[groupName] = list;
};

const addHide= ()=>{
  var style = doc.createElement('style');
  style.type = 'text/css';
  style.innerHTML = '.hide { display: none; } ';
  doc.getElementsByTagName('head')[0].appendChild(style);
}

const swap = (element: HTMLElement) => {
  if (element.classList.contains("hide")) {
    element.classList.remove("hide");
  } else {
    element.classList.add("hide")
  }
};
