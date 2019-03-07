import { setStorage, setDocument, bagItAndTagIt, put, get } from "./index";
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
    querySelectorAll: () => {
        return testElements;
    }
};
const store = { reg: { bingo: "no" } };
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
    test("Putting values into the reg", () => {
        const mockElement = document.createElement("div");
        mockElement.innerText = "house";
        mockElement.setAttribute("name", "bingo");
        put(mockElement);
        const what = get("bingo");
        console.log(what.currentValue);
        expect(what.currentValue).toBe("house");
    });
});
//# sourceMappingURL=index.test.js.map