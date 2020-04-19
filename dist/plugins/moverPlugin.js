let value;
let callback = (element) => { };
export const moverValue = v => value = v;
export const moverCallback = cb => callback = cb;
const elementsGroups = {};
export const moverPlugin = tools => {
    return { attributes: ["mover"], process: (element, name) => {
            const groupName = element.getAttribute("mover");
            if (!groupName) {
                return false;
            }
            storeElement(tools, groupName, element);
            tools.clickListener(element, () => {
                const list = elementsGroups[name];
                list.forEach(element => element.innerText = "");
                element.innerText = value;
                list.forEach(element => tools.put(element));
                callback(element);
            }, [name]);
            return true;
        } };
};
const storeElement = (tools, groupName, element) => {
    tools.put(element);
    const group = elementsGroups[groupName];
    const list = group === undefined ? [] : group;
    list.push(element);
    elementsGroups[groupName] = list;
};
//# sourceMappingURL=moverPlugin.js.map