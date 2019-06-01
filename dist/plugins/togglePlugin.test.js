import { togglePlugin, click } from "./togglePlugin";
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
        setValue: (el, value) => { mockElement.innerText = value; },
        clickListener: (element, fn) => { },
        stateListener: (id, fn) => { },
        fixID: (element, name) => { return element; }
    };
    let plugin;
    test("Plugin can be set up", () => {
        plugin = togglePlugin(binder);
    });
    test("Can register ", () => {
        plugin.process(mockElement);
        expect(mockElement.innerText).toBe('rugby');
        click(mockElement);
        expect(mockElement.innerText).toBe('long jump');
        click(mockElement);
        expect(mockElement.innerText).toBe('crime');
        click(mockElement);
        expect(mockElement.innerText).toBe('rugby');
        mockElement.innerText = "wrongone";
        click(mockElement);
        expect(mockElement.innerText).toBe('rugby');
    });
});
//# sourceMappingURL=togglePlugin.test.js.map