import { repeaterPlugin, addSetup } from "./repeaterPlugin";
import { BinderTools, RegEntry } from "../binderTypes";

const headerElement: HTMLElement = document.createElement("div");
headerElement.setAttribute("repeater", "header");
const headerPlaceElement: HTMLElement = document.createElement("div");
headerPlaceElement.setAttribute("place", "");
headerElement.appendChild(headerPlaceElement);

describe("repeaterPlugin.test", () => {
  const binder: BinderTools = {
    getValue: () => headerElement.innerText,
    getByName: s => headerElement.innerText,
    put: el => { },
    putElements: () => {},
    get: (k: string): RegEntry => {
      const blank = { currentValue: "", elements: Array<Element>() };
      return blank;
    },
    setValue:(el:HTMLElement,value:string) => {
      el.innerText = value;
    },
    setByName: (name:string, value: string) =>{},
    clickListener: (element: Element, fn: Function) => {},
    stateListener: (element: string, fn: Function) => {},
    fixID: (element: HTMLElement, name: string): HTMLElement => {return element}
  };
  let plugin;

  const headings = ["from", "to","depart","arrive","length"];

  test("Plugin can be set up", () => {
    addSetup("header",() => headings);
    plugin = repeaterPlugin(binder);
  });

  test("Can register ", () =>{
    plugin.process(headerElement, "header");
    headerElement.childNodes.forEach((node,i) => {
      const html = <HTMLElement> node;
      console.log(i,html.outerHTML);
      console.log(i,html.innerText);
    });
  })
});
