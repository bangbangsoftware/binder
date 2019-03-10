import { setStorage, setDocument, clear, bagItAndTagIt, put, get, registry, getValue } from "./index";
const mockElement = document.createElement("div");
mockElement.innerText = "bivouac";
mockElement.setAttribute("name", "placeToStay");
mockElement.setAttribute("id", "place1");
const mockElement2 = document.createElement("input");
mockElement2.setAttribute("value", "tunnel");
mockElement2.setAttribute("name", "placeToStay");
mockElement2.setAttribute("id", "place2");
mockElement.appendChild(mockElement2);
const testElements = [mockElement];
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
    getItem: (k) => JSON.stringify(store[k])
};
describe("The binder", () => {
    beforeAll(() => {
        setStorage(mockStore);
        setDocument(mocDoc);
    });
    test("start up", () => {
        bagItAndTagIt();
    });
    const dump = () => {
        console.log("*************");
        registry.placeToStay.elements.forEach((e) => {
            const value = getValue(e);
            console.log("DUMP", e.id, value);
        });
        console.log("==============");
    };
    const findElement = (id) => {
        return registry.placeToStay.elements.find(e => e.id == id);
    };
    test("Putting values into the reg", () => {
        const mockElement3 = document.createElement("div");
        mockElement3.innerText = "house";
        mockElement3.setAttribute("name", "placeToStay");
        mockElement3.setAttribute("id", "place3");
        put(mockElement3);
        const mockElement4 = document.createElement("input");
        mockElement4.setAttribute("value", "caravan");
        mockElement4.setAttribute("name", "placeToStay");
        mockElement4.setAttribute("id", "place4");
        put(mockElement4);
        const what = get("placeToStay");
        console.log("current Value", what.currentValue);
        expect(what.currentValue).toBe("caravan");
        expect(mockElement.innerText).toBe("caravan");
        expect(mockElement2.getAttribute("value")).toBe("caravan");
        expect(mockElement3.innerText).toBe("caravan");
        expect(mockElement4.getAttribute("value")).toBe("caravan");
        clear();
        const andNow = get("placeToStay");
        expect(andNow).toBeUndefined();
    });
});
//# sourceMappingURL=index.test.js.map