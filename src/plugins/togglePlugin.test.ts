import { togglePlugin, click } from "./togglePlugin";
import { BinderTools, RegEntry } from "../binderTypes";

const mockElement: HTMLElement = document.createElement("div");
mockElement.innerText = "rugby";
mockElement.setAttribute("name", "sports");
mockElement.setAttribute("id", "sport1");
mockElement.setAttribute("toggle", "rugby, long jump, crime");

describe("togglePlugin.test", () => {
  const binder: BinderTools = {
    getValue: () => mockElement.innerText,
    getByName: (s) => mockElement.innerText,
    put: () => {},
    putElements: () => {},
    get: (k: string): RegEntry => {
      const blank = { currentValue: "", elements: Array<Element>() };
      return blank;
    },
    getStartsWith: (key) => [key],
    removeStartsWith: (key) => {},
    setValue: (el: Element, value: string) => {
      mockElement.innerText = value;
    },
    setByName: (name: string, value: string) => {},
    clickListener: (element: Element, fn: Function) => {},
    stateListener: (id: string, fn: Function) => {},
    fixID: (element: HTMLElement, name: string): HTMLElement => {
      return element;
    },
  };
  let plugin;

  test("Plugin can be set up", () => {
    plugin = togglePlugin(binder);
  });

  test("Can register ", () => {
    plugin.process(mockElement);
    expect(mockElement.innerText).toBe("rugby");

    click(mockElement);
    expect(mockElement.innerText).toBe("long jump");

    click(mockElement);
    expect(mockElement.innerText).toBe("crime");

    click(mockElement);
    expect(mockElement.innerText).toBe("rugby");

    mockElement.innerText = "wrongone";
    click(mockElement);
    expect(mockElement.innerText).toBe("rugby");
  });
});
