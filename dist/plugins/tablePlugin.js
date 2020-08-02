let binder;
const done = Array();
const sortFuncs = new Map();
const tables = new Map();
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
    const data = keys.map((key) => binder.getStartsWith(name + "-" + key));
    const dataMap = Array();
    keys.forEach((key, index) => {
        const fieldArray = data[index];
        fieldArray.forEach((field, fieldIndex) => {
            const row = dataMap[fieldIndex] ? dataMap[fieldIndex] : {};
            row[key] = field;
            dataMap[fieldIndex] = row;
        });
    });
    return dataMap;
};
export const clearTable = (name, bdr = binder) => {
    //  const keysJSON = bdr.getByName(name + "-table-keys");
    //  if (!keysJSON) {
    //    return [];
    //  }
    //  const keys = <Array<any>>JSON.parse(keysJSON);
    // const length = parseInt(bdr.getByName(name + "-table-length"));
    //  if (!length) {
    //    return [];
    //  }
    //  keys.forEach((key) => {
    //    bdr.removeStartsWith(name + "-" + key);
    //  });
    bdr.removeStartsWith(name + "-");
};
export const addSetup = (name, setupData) => {
    if (setupData == undefined) {
        return;
    }
    const tableData = tables.get(name);
    const storedData = getStoredData(name, binder);
    const mapList = storedData.length > 0 ? storedData : setupData;
    if (tableData != undefined) {
        tableData.mapList = mapList;
        processData(tableData);
    }
};
export const addRow = (name, rowData) => {
    if (rowData == undefined) {
        return;
    }
    const tableData = tables.get(name);
    if (tableData != undefined) {
        tableData.mapList.push(rowData);
        tableData.save = true;
        processData(tableData);
    }
};
export const takeRow = (name, index) => {
    if (index < 0) {
        return;
    }
    const tableData = tables.get(name);
    if (tableData != undefined && tableData.mapList.length > index) {
        delete tableData.mapList[index];
        processData(tableData);
    }
};
export const overWrite = (name, setupData) => {
    if (setupData == undefined) {
        return;
    }
    const tableData = tables.get(name);
    if (tableData != undefined) {
        tableData.mapList = setupData;
        processData(tableData);
    }
};
export const addSort = (name, sortFn) => {
    const tableData = tables.get(name);
    sortFuncs.set(name, sortFn);
    if (tableData != undefined) {
        tableData.save = true;
        processData(tableData);
    }
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
            const data = generateData(binder, name, div);
            processData(data);
            return true;
        },
    };
};
const generateData = (binder, name, div) => {
    //const tableWorker = new Worker("./tablePluginWorker.js");
    const children = Array.prototype.slice.call(div.children);
    const templateRows = children.map((child) => child.outerHTML);
    const template = templateRows.join("\n");
    binder.populateStartsWith(name + "-");
    const storedData = getStoredData(name, binder);
    const mapList = storedData.length > 0 ? storedData : [];
    const save = storedData.length === 0;
    return { name, div, template, mapList, save };
};
const processData = (data) => {
    const tableWorker = new Worker("./dist/plugins/tablePluginWorker.js");
    //const tableWorker = new Worker("./tablePluginWorker.js");
    const sortFn = sortFuncs.get(data.name);
    if (sortFn) {
        data.mapList = data.mapList.sort((a, b) => sortFn(a, b));
    }
    tables.set(data.name, data);
    const workerData = [data.name, data.template, data.mapList];
    tableWorker.postMessage(workerData);
    tableWorker.onmessage = (mess) => {
        populateTemplate(data.name, mess, data.div, data.save);
        tableWorker.terminate();
    };
};
export const toggleClass = (name, row, classname) => {
    const keysJSON = binder.getByName(name + "-table-keys");
    if (!keysJSON) {
        return;
    }
    const keys = JSON.parse(keysJSON);
    const classes = adjustClasses(name, row, classname);
    binder.setByName(name + "-table-classes", JSON.stringify(classes));
    setClass(name, row, classname, keys);
};
export const rowsWithoutClass = (name, classname) => {
    const data = getStoredData(name, binder);
    const classesJSON = binder.getByName(name + "-table-classes");
    if (!classesJSON) {
        return data;
    }
    const classes = JSON.parse(classesJSON);
    classes.forEach((cl) => {
        delete data[cl.row];
    });
    return data;
};
const adjustClasses = (name, row, classname) => {
    const classesJSON = binder.getByName(name + "-table-classes");
    if (!classesJSON) {
        return [{ row, classname }];
    }
    const classes = JSON.parse(classesJSON);
    const alreadyHas = classes.find((rc) => rc.row === row && rc.classname === classname);
    if (alreadyHas) {
        // toggle out
        return classes.filter((rc) => rc.row !== row || rc.classname !== classname);
    }
    // Over write or insert
    const newClasses = classes.filter((rc) => rc.row != row);
    newClasses.push({ row, classname });
    return newClasses;
};
const setClass = (name, row, classname, keys) => {
    keys.forEach((key) => {
        var _a, _b, _c;
        const id = name + "-" + key + "-" + row;
        const element = document.getElementById(id);
        if ((_a = element) === null || _a === void 0 ? void 0 : _a.classList.contains(classname)) {
            (_b = element) === null || _b === void 0 ? void 0 : _b.classList.remove(classname);
        }
        else {
            (_c = element) === null || _c === void 0 ? void 0 : _c.classList.add(classname);
        }
    });
};
const reclass = (name) => {
    const keysJSON = binder.getByName(name + "-table-keys");
    if (!keysJSON) {
        return;
    }
    const keys = JSON.parse(keysJSON);
    const classesJSON = binder.getByName(name + "-table-classes");
    if (!classesJSON) {
        return;
    }
    const classes = JSON.parse(classesJSON);
    classes.forEach((cr) => setClass(name, cr.row, cr.classname, keys));
};
const populateTemplate = (name, workerData, div, save) => {
    const html = workerData.data.html;
    const returnData = workerData.data.data;
    const generated = new DOMParser().parseFromString(html, "text/html");
    const body = generated.getElementsByTagName("BODY")[0];
    const children = Array.prototype.slice.call(body.children);
    const keys = new Set();
    div.innerHTML = "";
    const datas = children.map((child, index) => {
        const id = child.id;
        const data = returnData[id];
        const end = id.lastIndexOf("-");
        const key = id.substring(name.length + 1, end);
        if (key.indexOf("$index") === -1 && data) {
            keys.add(key);
        }
        if (data) {
            child.innerText = data;
        }
        div.appendChild(child);
        return data;
    });
    if (save) {
        binder.putElements(children, datas);
        binder.setByName(name + "-table-keys", JSON.stringify([...keys]));
        const length = keys.size === 0 ? 0 : datas.length / keys.size;
        binder.setByName(name + "-table-length", length + "");
    }
    reclass(name);
};
//# sourceMappingURL=tablePlugin.js.map