import { repeaterPlugin, addSetup } from "./repeaterPlugin";
const headerElement = document.createElement("div");
headerElement.setAttribute("repeater", "header");
const headerPlaceElement = document.createElement("div");
headerPlaceElement.setAttribute("place", "");
headerElement.appendChild(headerPlaceElement);
describe("repeaterPlugin.test", () => {
    const binder = {
        getValue: () => headerElement.innerText,
        put: el => { },
        get: (k) => {
            const blank = { currentValue: "", elements: Array() };
            return blank;
        },
        setValue: (el, value) => {
            el.innerText = value;
        },
        setByName: (name, value) => { },
        clickListener: (element, fn) => { },
        stateListener: (element, fn) => { },
        fixID: (element, name) => { return element; }
    };
    let plugin;
    const headings = ["from", "to", "depart", "arrive", "length"];
    test("Plugin can be set up", () => {
        addSetup("header", () => headings);
        plugin = repeaterPlugin(binder);
    });
    test("Can register ", () => {
        plugin.process(headerElement, "header");
        headerElement.childNodes.forEach((node, i) => {
            const html = node;
            console.log(i, html.outerHTML);
            console.log(i, html.innerText);
        });
    });
});
//# sourceMappingURL=repeaterPlugin.test.js.map