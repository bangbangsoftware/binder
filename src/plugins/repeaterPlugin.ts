import { BinderTools } from "../binderTypes";

let binder: BinderTools;

const data: Map<string, Array<any>> = new Map<string, Array<any>>();

export const addData = (name:string, list: Array<any>) => {
  data.set(name, list);
}

export const repeaterPlugin = (tools: BinderTools) => {
  binder = tools;
  console.log("** Repeater plugin **");
  return {
    attributes: ["repeater"],
    process: (element: Element, repeaterName: string): boolean => {
      const list = data.get(repeaterName);
      if (list == null){
        console.error("No data been defined for '"+repeaterName+"' ");
        return false;
      }
      const parent = element.parentNode;
      if (parent == null){
        return false;
      }
      parent.removeChild(element);
      const newDiv = build(parent, element, repeaterName, list);
      element.replaceWith(newDiv);
      element = newDiv;
      return true;
    }
  };
};

const build = (parent: Node, element: Element, name: string, data: Array<any>): Element => {
  const news = data.map((bit,i) => {
    const birth = <Element>element.cloneNode(true);
    birth.removeAttribute("repeater");
    const placeHolders = findPlace(birth, []);
    const id = name+"-"+i;
    birth.id = id;
    setValues(placeHolders, id, bit, i);
    return birth;
  });
  news.forEach((newElement,i)=>parent.insertBefore(newElement,element.nextSibling));
  return element;
};

const getValue = (el: HTMLElement, index: number, data: any):string => {
  const key = el.getAttribute("place");
  if (!key){
    return data;
    
  }
  if (key === "$index"){
    return ""+index;
  }
  return data[key];
}

const setValues = (placeHolders: Array<Element>, id: string, data: any , i: number) => {
  placeHolders.forEach((el: HTMLElement, index: number) => {
    const value = getValue(el,i, data);
    el.id = id + "-"+index;
    el.setAttribute("name", el.id);
    el.removeAttribute("place");
    binder.setValue(el, value);
    binder.put(el);
  });
};

const findPlaceInChildNodes = (
  childNodes: NodeListOf<ChildNode>,
  result: Array<Element>
): Array<Element> => {
  childNodes.forEach(node => findPlace(<Element>node, result));
  return result;
};

const findPlace = (
  element: Element,
  result: Array<Element>
): Array<Element> => {
  if (element.hasAttribute && element.hasAttribute("place")) {
    result.push(element);
  }
  return findPlaceInChildNodes(element.childNodes, result);
};
