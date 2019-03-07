import {
  setStorage,
  setDocument,
  clear,
  bagItAndTagIt,
  put,
  get
} from "./index";

let testElements = [];
const mocDoc = {
  getElementsByTagName: tagName => {
    if (tagName === "BODY") {
      return [
        {
          style: { display: "block" }
        }
      ];
    }
  },
  querySelectorAll: () =>{
      return testElements;
  }
};
const store = {};
const mockStore = {
  setItem: (k, v) => {
    store[k] = v;
  },
  getItem: k => store[k]
};

describe("The binder", () => {
  beforeAll(() => {
    setStorage(mockStore);
    setDocument(mocDoc);
  });

  test("start up", () => {
    bagItAndTagIt();
  });

  test("Putting values into the reg", () =>{
    const mockElement:Element = new Element();
    put(mockElement);
    expect(store).toBe("sjkdhfkj");
  });
});
