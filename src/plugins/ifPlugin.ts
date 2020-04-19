import { BinderPlugin, BinderTools } from "../binderTypes";

// Just for testing....
let doc = document;
export function setDocument(d) {
  doc = d;
}

export const ifPlugin: BinderPlugin = tools => {
  addHide();
  return {
    attributes: ["if"],
    process: (ifElement: HTMLElement, name: string): boolean => {
      console.log("IFP if Plugin");
      const fieldID = ifElement.getAttribute("if");
      if (!fieldID) {
        console.log("IFP Error with ",ifElement);
        return false;
      }
      console.log("IFP - "+fieldID + " has an if.... ");
      tools.stateListener(fieldID, (valueElement: HTMLElement) => {
        const value = getValue(tools, fieldID);
        swap(ifElement,value);
      });
      const value = getValue(tools, fieldID);
      swap(ifElement,value);
      return true;
    }
  };
};

const getValue = (tools: BinderTools, fieldID:string)=>{
  const valueElement = <HTMLElement>doc.getElementById(fieldID);
  if (valueElement == null){
    return getValueFromStorage(tools, fieldID);
  }
  const value = tools.getValue(valueElement);
  return value
}

const getValueFromStorage = (tools: BinderTools, fieldID:string) =>{
  const regEntry = tools.get(fieldID);
  if (regEntry == null){
    return null;
  }
  return regEntry.currentValue
}

const addHide = () => {
  var style = doc.createElement("style");
  style.type = "text/css";
  style.innerHTML = ".hide { display: none; } ";
  doc.getElementsByTagName("head")[0].appendChild(style);
};

const hasValue = value => {
  if (value == undefined) {
    return false;
  }
  if (value == null) {
    return false;
  }
  return value.trim().length > 0;
};

const swap = (element: HTMLElement, value: string | null) => {
//  console.log(element.id + " >>", value, "<< " + hasValue(value));
  if (hasValue(value)) {
    console.log("IFP - removing " + element.id + " hiding");
    element.classList.remove("hide");
  } else {
    console.log("IFP - "+element.id + " hiding");
    element.classList.add("hide");
  }
};
