let binder;
const clickFns = new Map();
export const addClickFunction = (name, fn) => {
    console.log("Added click for ", name);
    clickFns.set(name, fn);
};
const generateRunner = (name, tools) => (ev) => {
    const fn = clickFns.get(name);
    if (fn == null) {
        console.error("No click function for " + name);
        console.error("Need to add some code like:");
        console.error('%c import { clickPlugin, addClickFunction } from "./dist/plugins/clickPlugin.js"; ', 'background: #222; color: #bada55');
        console.error('');
        console.error('%c addClickFunction("' + name + '", (tools, ev) => { ', 'background: #222; color: #bada55');
        console.error('%c       alert("BOOOOM!"); ', 'background: #222; color: #bada55');
        console.error('%c });', 'background: #222; color: #bada55');
        return;
    }
    fn(tools, ev);
};
export const clickPlugin = (tools) => {
    binder = tools;
    console.log("** Click plugin **");
    return {
        attributes: ["click"],
        process: (element, clickFunctionName) => {
            console.log("Found click element ", element, " with function named ", clickFunctionName);
            if (!clickFunctionName) {
                console.error("No click function name defined ", element);
                return false;
            }
            const runner = generateRunner(clickFunctionName, tools);
            binder.clickListener(element, (ev) => runner(ev));
            return true;
        }
    };
};
//# sourceMappingURL=clickPlugin.js.map