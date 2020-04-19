import { BinderTools } from "../binderTypes";

let binder: BinderTools;

const clickFns = new Map<String, Function>(); 

export interface ClickFunction {
  (e: Event, tools: BinderTools): void
}

export const addClickFunction = (name:string,fn: ClickFunction) => {
  console.log("Added click for ", name);
  clickFns.set(name, fn)
}; 

const generateRunner = (name: string, tools: BinderTools) => (ev: Event) => {
  const fn = clickFns.get(name);
  if (fn == null){
    console.error("No click function for "+name);
    console.error("Need to add some code like:");
    console.error('%c import { clickPlugin, addClickFunction } from "./dist/plugins/clickPlugin.js"; ', 'background: #222; color: #bada55');
    console.error('');
    console.error('%c addClickFunction("'+name+'", (tools, ev) => { ', 'background: #222; color: #bada55');
    console.error('%c       alert("BOOOOM!"); ', 'background: #222; color: #bada55');
    console.error('%c });', 'background: #222; color: #bada55');
    return;
  }
  fn(tools, ev);
}

export const clickPlugin = (tools: BinderTools) => {
  binder = tools;
  console.log("** Click plugin **");
  return {
    attributes: ["click"],
    process: (element: Element, clickFunctionName: string): boolean => {
      console.log("Found click element ",element, " with function named ",clickFunctionName);
      if (!clickFunctionName){
        console.error("No click function name defined ",element);
        return false;
      }
      const runner = generateRunner(clickFunctionName, tools); 
      binder.clickListener(element,(ev:Event) => runner(ev));     
      return true;  
    }
  };
};
