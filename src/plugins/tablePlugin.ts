import { BinderTools, BinderPlugin } from "../binderTypes";
import data from "../data";

let binder: BinderTools;
const done = Array<String>();

const sortFuncs = new Map<string, Function>();
const tables = new Map<string, TableData>();
interface TableData {
  div: Element;
  name: string;
  template: string;
  mapList: any[];
  save: boolean;
}

const next = (name: string, keys: Array<string>, row: number) => {
  return name + "-" + keys[0] + "-" + row;
};

const getStoredData = (name: string, binder: BinderTools): Array<any> => {
  const keysJSON = binder.getByName(name + "-table-keys");
  if (!keysJSON) {
    return [];
  }
  const keys = <Array<any>>JSON.parse(keysJSON);
  const length = parseInt(binder.getByName(name + "-table-length"));
  if (!length) {
    return [];
  }
  const dataMap = Array<any>();
  let rowInt = 0;
  while (binder.getByName(next(name, keys, rowInt))) {
    const row = {};
    keys.forEach((key) => {
      row[key] = binder.getByName(name + "-" + key + "-" + rowInt);
    });
    dataMap.push(row);
    rowInt++;
  }
  return dataMap;
};

export const addSetup = (name: string, setupData: any[]) => {
  if (setupData == undefined) {
    return;
  }
  const tableData: TableData | undefined = tables.get(name);
  const storedData = getStoredData(name, binder);
  const mapList: any[] = storedData.length > 0 ? storedData : setupData;
  if (tableData != undefined) {
    tableData.mapList = mapList;
    processData(tableData);
  }
};

export const addRow = (name: string, rowData: any[]) => {
  if (rowData == undefined) {
    return;
  }
  const tableData: TableData | undefined = tables.get(name);
  if (tableData != undefined) {
    tableData.mapList.push(rowData);
    processData(tableData);
  }
};

export const takeRow = (name: string, index: number) => {
  if (index < 0) {
    return;
  }
  const tableData: TableData | undefined = tables.get(name);
  if (tableData != undefined && tableData.mapList.length - 1 > index) {
    delete tableData.mapList[index];
    processData(tableData);
  }
};

export const overWrite = (name: string, setupData: any[]) => {
  if (setupData == undefined) {
    return;
  }
  const tableData: TableData | undefined = tables.get(name);
  if (tableData != undefined) {
    tableData.mapList = setupData;
    processData(tableData);
  }
};

export const addSort = (name: string, sortFn: Function) => {
  const tableData: TableData | undefined = tables.get(name);
  sortFuncs.set(name, sortFn);
  if (tableData != undefined) {
    tableData.save = true;
    processData(tableData);
  }
};

export const tablePlugin: BinderPlugin = (tools: BinderTools) => {
  binder = tools;
  console.log("** Table plugin **");
  return {
    attributes: ["table"],
    process: (div: Element, name: string): boolean | Promise<boolean> => {
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

const generateData = (
  binder: BinderTools,
  name: string,
  div: Element
): TableData => {
  //const tableWorker = new Worker("./tablePluginWorker.js");
  const children = Array.prototype.slice.call(div.children);
  const templateRows = children.map((child) => child.outerHTML);
  const template = templateRows.join("\n");

  const storedData = getStoredData(name, binder);
  const mapList: any[] = storedData.length > 0 ? storedData : [];
  const save = storedData.length === 0;

  return { name, div, template, mapList, save };
};

const processData = (data: TableData) => {
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
  };
};

const populateTemplate = (
  name: string,
  workerData,
  div: Element,
  save: boolean
) => {
  const html = workerData.data.html;
  const returnData = workerData.data.data;

  const generated = new DOMParser().parseFromString(html, "text/html");
  const body = generated.getElementsByTagName("BODY")[0];
  div.innerHTML = "";
  const children = Array.prototype.slice.call(body.children);
  const keys = new Set<String>();
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