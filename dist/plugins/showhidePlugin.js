const elementsGroups = {};
export const showHidePlugin = () => {
    return (element) => {
        const groupName = element.getAttribute("showhide");
        if (groupName) {
            storeElement(groupName, element);
            return;
        }
        const name = element.getAttribute("showhide-trigger");
        if (!name) {
            return;
        }
        element.addEventListener("click", () => {
            console.log("BOOM");
            const list = elementsGroups[name];
            console.log(list);
            list.forEach(element => swap(element));
        });
    };
};
const storeElement = (groupName, element) => {
    const group = elementsGroups[groupName];
    const list = group === undefined ? [] : group;
    list.push(element);
    elementsGroups[groupName] = list;
};
const swap = (element) => {
    if (element.classList.contains("hide")) {
        element.classList.remove("hide");
    }
    else {
        element.classList.add("hide");
    }
};
//# sourceMappingURL=showhidePlugin.js.map