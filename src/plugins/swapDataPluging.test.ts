import {
  swapDataPlugin,
  setStorage,
  setDocument,
  click,
} from "./swapDataPlugin";
import { BinderTools, RegEntry } from "../binderTypes";

const mockElement: HTMLElement = document.createElement("div");
mockElement.innerText = "rugby";
mockElement.setAttribute("name", "sports");
mockElement.setAttribute("id", "sport1");
mockElement.setAttribute("swap-data", "boomer");

const mockElement2: HTMLElement = document.createElement("div");
mockElement2.innerText = "100 meters";
mockElement2.setAttribute("name", "sports");
mockElement2.setAttribute("id", "sport2");
mockElement2.setAttribute("swap-data", "boomer");

const mapper = {};
const store = {
  getItem: (id) => mapper[id],
  setItem: (key, value) => {
    mapper[key] = "" + value;
  },
  removeItem: (key) => delete mapper[key],
};
setStorage(store);
const doc = {
  getElementById: (id) => {
    if (id === "sport1") {
      return mockElement;
    }
    return mockElement2;
  },
};
setDocument(doc);
const binder: BinderTools = {
  getValue: (el) => doc.getElementById(el.id).innerText,
  getByName: (s) => mockElement.innerText,
  put: () => {},
  putElements: () => {},
  get: (k: string): RegEntry => {
    const blank = { currentValue: "", elements: Array<Element>() };
    return blank;
  },
  setValue: (el: Element, value: string) => {
    doc.getElementById(el.id).innerText = value;
  },
  setByName: (name: string, value: string) => {},
  clickListener: (element: Element, fn: Function) => {},
  stateListener: (element: string, fn: Function) => {},
  fixID: (element: HTMLElement, name: string): HTMLElement => {
    return element;
  },
};

describe("swapDataPlugin.test", () => {
  let plugin;

  test("Plugin can be set up", () => {
    plugin = swapDataPlugin(binder);
  });

  test("Can register ", () => {
    plugin.process(mockElement);
    plugin.process(mockElement2);
    expect(mockElement.innerText).toBe("rugby");

    click(mockElement);
    click(mockElement2);
    expect(mockElement.innerText).toBe("100 meters");

    click(mockElement);
    click(mockElement2);
    expect(mockElement.innerText).toBe("rugby");

    click(mockElement);
    click(mockElement);
    expect(mockElement.innerText).toBe("rugby");
  });
});
