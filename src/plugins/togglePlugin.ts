import { BinderTools } from "../binderTypes";

let binder: BinderTools;

export const togglePlugin = (tools: BinderTools) => {
  binder = tools;
  return {attributes:["toggle"], process:(element: Element, name: string):boolean => {
    tools.clickListener(element, (e:Event) => click(element), [name]);
    return true;
  }};
};

export const click = (element: Element) => {
  const listString = element.getAttribute("toggle") || "";
  const list = listString.split(/,/).map(t => t.trim());
  const value = binder.getValue(element);
  const index = <number>list
    .map(
      (l: string, index: number): number | boolean => {
        const v = l.trim();
        return v === value ? index : false;
      }
    )
    .find((k: number | boolean) => k !== false);
  if (index === undefined) {
    console.error("Cannot find element with value '" + value + "'");
    binder.setValue(element, list[0]);
    binder.put(element);
    return;
  }
  const newIndex = list.length > index + 1 ? index + 1 : 0;
  binder.setValue(element, list[newIndex]);
  binder.put(element);
};
