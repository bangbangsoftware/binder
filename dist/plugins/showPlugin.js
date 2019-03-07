let doc = document;
// Just for testing....
export function setDocument(d) {
    doc = d;
}
const hides = {};
export const showPlugin = () => element => {
    const name = element.getAttribute("show");
    if (!name) {
        return;
    }
    const list = hides[name] ? hides[name] : [];
    const display = "" + element.style.display;
    const block = { display, element };
    if (list.length === 0) {
        doc.addEventListener("show-" + name, (e) => listener(name, e.detail));
    }
    else {
        element.style.display = "none";
    }
    list.push(block);
    hides[name] = list;
};
const listener = (name, id) => {
    const list = hides[name] ? hides[name] : [];
    const block = list.find(b => b.element.id === id);
    block.element.style.display = block.display;
    const others = list.filter(b => b.element.id !== id);
    const newlist = others.map(b => {
        const display = b.element.style.display === "none" ? b.display : b.element.style.display;
        b.element.style.display = "none";
        return { element: b.element, display };
    });
    const showBlock = { element: block.element, display: block.display };
    newlist.push(showBlock);
    hides[name] = newlist;
};
//# sourceMappingURL=showPlugin.js.map