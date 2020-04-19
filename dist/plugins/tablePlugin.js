let binder;
const done = Array();
const setupFuncs = new Map();
const getSetupData = (name) => {
    const fn = setupFuncs.get(name);
    return fn === undefined ? [] : fn();
};
const getStoredData = (name, binder) => {
    const keysJSON = binder.getByName(name + "-table-keys");
    if (!keysJSON) {
        return [];
    }
    const keys = JSON.parse(keysJSON);
    const length = parseInt(binder.getByName(name + "-table-length"));
    if (!length) {
        return [];
    }
    const dataMap = Array();
    let rowInt = 0;
    while (binder.getByName(keys[0] + "-" + rowInt)) {
        const row = keys.map((key) => {
            const col = {};
            col[key] = binder.getByName(key + "-" + rowInt);
            return col;
        });
        dataMap.push(row);
        rowInt++;
    }
    return dataMap;
};
export const addSetup = (name, setupFn) => {
    setupFuncs.set(name, setupFn);
};
export const tablePlugin = (tools) => {
    binder = tools;
    console.log("** Table plugin **");
    return {
        attributes: ["table"],
        process: (div, name) => {
            if (done[name]) {
                return false;
            }
            done.push(name);
            if (!window.Worker) {
                console.error("TABLE: No worker, what old browser are you using!?!");
                return false;
            }
            kickoffWorker(binder, name, div);
            return true;
        },
    };
};
const kickoffWorker = (binder, name, div) => {
    const tableWorker = new Worker("./dist/plugins/tablePluginWorker.js");
    //const tableWorker = new Worker("./tablePluginWorker.js");
    const children = Array.prototype.slice.call(div.children);
    const templateRows = children.map((child) => child.outerHTML);
    const template = templateRows.join("\n");
    const setupData = getSetupData(name);
    const storedData = getStoredData(name, binder);
    const mapList = storedData.length > 0 ? storedData : setupData;
    const save = storedData.length === 0;
    const data = [name, template, mapList];
    tableWorker.postMessage(data);
    tableWorker.onmessage = (mess) => {
        populateTemplate(name, mess, div, save);
    };
};
const populateTemplate = (name, workerData, div, save) => {
    const html = workerData.data.html;
    const returnData = workerData.data.data;
    const generated = new DOMParser().parseFromString(html, "text/html");
    const body = generated.getElementsByTagName("BODY")[0];
    div.innerHTML = "";
    const children = Array.prototype.slice.call(body.children);
    const keys = new Set();
    const datas = children.map((child) => {
        const id = child.id + "";
        const data = returnData[id];
        const end = id.lastIndexOf("-");
        const key = id.substring(name.length + 1, end);
        if (key.indexOf("$index") === -1) {
            keys.add(key);
        }
        child.innerText = data;
        div.appendChild(child);
        return data;
    });
    if (save) {
        binder.putElements(children, datas);
        binder.setByName(name + "-table-keys", JSON.stringify([...keys]));
        const length = datas.length / keys.size;
        binder.setByName(name + "-table-length", length + "");
    }
};
//# sourceMappingURL=tablePlugin.js.map