import { swapperPlugin, setStorage, setDocument } from "./swapperPlugin";
const mockElement = document.createElement("div");
mockElement.innerText = "rugby";
mockElement.setAttribute("name", "sports");
mockElement.setAttribute("id", "sport1");
mockElement.setAttribute("swapper", "boomer");
const mockElement2 = document.createElement("div");
mockElement2.innerText = "100 meters";
mockElement2.setAttribute("name", "sports");
mockElement2.setAttribute("id", "sport2");
mockElement2.setAttribute("swapper", "boomer");
const mapper = {};
const store = {
    getItem: id => mapper[id],
    setItem: (key, value) => {
        mapper[key] = "" + value;
    },
    removeItem: key => delete mapper[key]
};
setStorage(store);
const doc = {
    getElementById: id => {
        if (id === "sport1") {
            return mockElement;
        }
        return mockElement2;
    }
};
setDocument(doc);
const binder = {
    getValue: el => doc.getElementById(el.id).innerText,
    put: () => { },
    get: (k) => {
        const blank = { currentValue: "", elements: Array() };
        return blank;
    },
    setValue: (el, value) => {
        doc.getElementById(el.id).innerText = value;
    }
};
describe("swapperPlugin.test", () => {
    let plugin;
    test("Plugin can be set up", () => {
        plugin = swapperPlugin(binder);
    });
    test("Can register ", () => {
        plugin(mockElement);
        plugin(mockElement2);
        expect(mockElement.innerText).toBe("rugby");
        mockElement.click();
        mockElement2.click();
        expect(mockElement.innerText).toBe("100 meters");
        mockElement.click();
        mockElement2.click();
        expect(mockElement.innerText).toBe("rugby");
        mockElement.click();
        mockElement.click();
        expect(mockElement.innerText).toBe("rugby");
    });
});
//# sourceMappingURL=swapperPlugin.test.js.map