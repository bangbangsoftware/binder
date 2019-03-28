let binder;
export const togglePlugin = (tools) => {
    binder = tools;
    return (element) => {
        const groupName = element.getAttribute("toggle");
        if (!groupName) {
            return;
        }
        tools.clickListener(element, (e) => swap(element));
    };
};
const swap = (element) => {
    const listString = element.getAttribute("toggle") || "";
    const list = listString.split(/,/).map(t => t.trim());
    const value = binder.getValue(element);
    const index = list
        .map((l, index) => {
        const v = l.trim();
        return v === value ? index : false;
    })
        .find((k) => k !== false);
    if (index === undefined) {
        console.error("Cannot find element with value '" + value + "'");
        binder.setValue(element, list[0]);
        binder.put(element);
        return;
    }
    const newIndex = list.length > index + 1 ? index + 1 : 0;
    binder.setValue(element, list[newIndex]);
    binder.put(element);
};
//# sourceMappingURL=togglePlugin.js.map