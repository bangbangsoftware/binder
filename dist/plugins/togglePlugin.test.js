import { togglePlugin } from "./togglePlugin";
const mockElement = document.createElement("div");
mockElement.innerText = "rugby";
mockElement.setAttribute("name", "sports");
mockElement.setAttribute("id", "sport1");
mockElement.setAttribute("toggle", "rugby, long jump, crime");
describe("togglePlugin.test", () => {
    const binder = {
        getValue: () => mockElement.innerText,
        put: () => { },
        get: (k) => {
            const blank = { currentValue: "", elements: Array() };
            return blank;
        },
        setValue: (el, value) => { mockElement.innerText = value; }
    };
    let plugin;
    test("Plugin can be set up", () => {
        plugin = togglePlugin(binder);
    });
    test("Can register ", () => {
        plugin(mockElement);
        expect(mockElement.innerText).toBe('rugby');
        mockElement.click();
        expect(mockElement.innerText).toBe('long jump');
        mockElement.click();
        expect(mockElement.innerText).toBe('crime');
        mockElement.click();
        expect(mockElement.innerText).toBe('rugby');
        mockElement.innerText = "wrongone";
        mockElement.click();
        expect(mockElement.innerText).toBe('rugby');
    });
});
//# sourceMappingURL=togglePlugin.test.js.map