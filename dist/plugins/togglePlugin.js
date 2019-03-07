let binder;
export const togglePlugin = tools => {
    binder = tools;
    return element => {
        const groupName = element.getAttribute("toggle");
        if (!groupName) {
            return;
        }
        element.addEventListener("click", e => swap(element));
    };
};
const swap = element => {
    const listString = element.getAttribute("toggle");
    const list = listString.split(/,/);
    const key = binder.getKey(element);
    const value = element[key];
    const index = list.map((l, index) => {
        const v = l.trim();
        return (v === value) ? index : false;
    }).find(k => k !== false);
    const newIndex = list.length > index + 1 ? index + 1 : 0;
    element[key] = list[newIndex];
    binder.put(element);
};
//# sourceMappingURL=togglePlugin.js.map