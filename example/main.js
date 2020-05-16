import { go, tools, addClickFunction } from "./dist/index.js";

import { ifPlugin } from "./dist/plugins/ifPlugin.js";
import {
  tablePlugin,
  addSetup,
  addSort,
  addRow,
  takeRow,
} from "./dist/plugins/tablePlugin.js";
import { swapDataPlugin } from "./dist/plugins/swapDataPlugin.js";
import { showHidePlugin } from "./dist/plugins/showhidePlugin.js";
import { togglePlugin } from "./dist/plugins/togglePlugin.js";
import { moverPlugin } from "./dist/plugins/moverPlugin.js";
import { swapElementPlugin } from "./dist/plugins/swapElementPlugin.js";

import data from "./data.js";

console.log(
  "%cBinder Demo Page....",
  "background: red; color: yellow; font-size: x-large"
);

/** 
 * TODO
 *
 * From Binder... 

import { bagItAndTagIt, put, get, setMode, getMode, tools } from "binder";   - TODO 
import { togglePlugin } from "binder/dist/plugins/togglePlugin";                                 - DONE
import { showHidePlugin } from "binder/dist/plugins/showhidePlugin";                             - DONE
import { ifPlugin } from "binder/dist/plugins/ifPlugin";                                         - DONE
import { swapPlugin, actionMover } from "binder/dist/plugins/swapPlugin.js";                     - DONE
11
 *  change swapper to swapValue and swapElement
 * 
 */

// Go!
go([
  ifPlugin,
  moverPlugin,
  tablePlugin,
  swapDataPlugin,
  showHidePlugin,
  togglePlugin,
  swapElementPlugin,
]);

// 0. install copy...
addClickFunction("copy", async () => {
  const copyText = document.getElementById("npm");
  try {
    await navigator.clipboard.writeText(copyText.innerText);
    console.log("Copied to clipbopard");
    const mess = document.getElementById("message");
    mess.innerText = "Copied to the clipboard";
  } catch (err) {
    console.error("Could not copy text: ", err);
  }
});

// 1. Simple start - extra
const clearSport = () => {
  tools.setByName("sport", "");
};
addClickFunction("clearSport", clearSport);

// 6. Click away
const changeHours = (amount) => {
  const hours = parseInt(tools.getByName("danceFor"));
  const calculate = hours + amount;
  const result = calculate < 0 ? 0 : calculate;
  tools.setByName("danceFor", result);
};

addClickFunction("addHour", () => changeHours(1));
addClickFunction("takeHour", () => changeHours(-1));
tools.setByName("danceFor", 0);

// 7. Bring it to the table - table plugin
const pops = data().map((list) => ({
  Name: list[0],
  County: list[1],
  "Census 2001-04-29": list[2],
  "Census 2011-03-27": list[3],
  "Estimate 2018-06-30": list[4],
}));
addSetup("pops", pops);

const sorter = (field, fn) => (direction) => (a, b) => {
  const first = fn(a[field]);
  const sec = fn(b[field]);
  if (first > sec) {
    return direction;
  }
  if (first < sec) {
    return direction * -1;
  }
  return 0;
  1;
};

let direction = 1;
const sort = (event) => {
  console.log("sort ", event);
  const field = event.target.textContent;
  const number = field.indexOf("-") > -1;
  const parseFn = number ? (s) => parseInt(s) : (s) => s;
  const est = sorter(event.target.textContent, parseFn);
  direction = direction * -1;
  console.log("direction ", direction);
  const fn = est(direction);
  addSort("pops", (a, b) => fn(a, b));
};

const take = (event) => {
  const id = event.target.id + "";
  const startIndex = parseInt(id.lastIndexOf("-")) + 1;
  const remove = parseInt(id.substring(startIndex));
  takeRow("pops", remove);
};

addClickFunction("sorter", sort);
addClickFunction("addTown", () => addRow("pops", pops[0]));
addClickFunction("takeTop", () => takeRow("pops", 0));
addClickFunction("take", take);
