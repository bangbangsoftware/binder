import {
  setStorage,
  setDocument,
  clear,
  bagItAndTagIt,
  put,
  get,
  registry,
  getValue,
} from "./binder";

const mockElement: HTMLElement = document.createElement("div");
mockElement.innerText = "bivouac";
mockElement.setAttribute("name", "placeToStay");
mockElement.setAttribute("id", "place1");

const mockElement2: HTMLInputElement = document.createElement("input");
mockElement2.setAttribute("value", "tunnel");
mockElement2.setAttribute("name", "placeToStay");
mockElement2.setAttribute("id", "place2");

mockElement.appendChild(mockElement2);

const testElements = [mockElement];
const mocDoc = {
  getElementsByTagName: (tagName) => {
    if (tagName === "BODY") {
      return [
        {
          style: { display: "block" },
        },
      ];
    }
  },
  addEventListener: (eventName: string, fn: Function) => {
    //console.log("event:"+name);
    //console.log(fn);
  },
  querySelectorAll: () => {
    return testElements;
  },
};
const store = { reg: { bingo: "no" } };
const mockStore = {
  setItem: (k: string, v) => {
    store[k] = v;
  },
  getItem: (k: string) => JSON.stringify(store[k]),
};

describe("The binder", () => {
  beforeAll(() => {
    setStorage(mockStore);
    setDocument(mocDoc);
  });

  test("start up", () => {
    bagItAndTagIt();
  });

  test("Putting values into the reg", () => {
    const mockElement3: HTMLElement = document.createElement("div");
    mockElement3.innerText = "house";
    mockElement3.setAttribute("name", "placeToStay");
    mockElement3.setAttribute("id", "place3");
    const reg = put(mockElement3);
    console.log("reg", reg);

    const mockElement4: HTMLElement = document.createElement("input");
    mockElement4.setAttribute("value", "caravan");
    mockElement4.setAttribute("name", "placeToStay");
    mockElement4.setAttribute("id", "place4");
    const reg2 = put(mockElement4);
    console.log("reg2", reg2);

    const what = get("placeToStay");
    if (what == null) {
      expect(what).toBeDefined;
    } else {
      console.log("current Value", what.currentValue);
      expect(what.currentValue).toBe("caravan");
    }

    expect(mockElement.innerText).toBe("caravan");
    expect(mockElement2.value).toBe("caravan");
    expect(mockElement3.innerText).toBe("caravan");
    expect(mockElement4.getAttribute("value")).toBe("caravan");

    clear();
    const andNow = get("placeToStay");
    expect(andNow).toBeUndefined();
  });
});
