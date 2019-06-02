// Just for testing....
let doc = document;
export function setDocument(d) {
    doc = d;
}
export const ifPlugin = tools => {
    addHide();
    return {
        attributes: ["if"],
        process: (ifElement, name) => {
            const fieldID = ifElement.getAttribute("if");
            if (!fieldID) {
                return false;
            }
            console.log("IFP - " + fieldID + " has an if.... ");
            0;
            tools.stateListener(fieldID, (valueElement) => {
                const value = getValue(tools, fieldID);
                swap(ifElement, value);
            });
            const value = getValue(tools, fieldID);
            swap(ifElement, value);
            return true;
        }
    };
};
const getValue = (tools, fieldID) => {
    const valueElement = doc.getElementById(fieldID);
    if (valueElement == null) {
        return getValueFromStorage(tools, fieldID);
    }
    const value = tools.getValue(valueElement);
    return value;
};
const getValueFromStorage = (tools, fieldID) => {
    const regEntry = tools.get(fieldID);
    if (regEntry == null) {
        return null;
    }
    return regEntry.currentValue;
};
const addHide = () => {
    var style = doc.createElement("style");
    style.type = "text/css";
    style.innerHTML = ".hide { display: none; } ";
    doc.getElementsByTagName("head")[0].appendChild(style);
};
const hasValue = value => {
    if (value == undefined) {
        return false;
    }
    if (value == null) {
        return false;
    }
    return value.trim().length > 0;
};
const swap = (element, value) => {
    console.log(element.id + " >>", value, "<< " + hasValue(value));
    if (hasValue(value)) {
        console.log("IFP - removing " + element.id + " hiding");
        element.classList.remove("hide");
    }
    else {
        console.log("IFP - " + element.id + " hiding");
        element.classList.add("hide");
    }
    console.log("");
};
//# sourceMappingURL=ifPlugin.js.map