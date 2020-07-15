import {
  addClickFunction,
  go,
  getByName,
  put,
  get,
  setValue,
} from "./dist/index.js";
import { addRow, toggleClass } from "./dist/plugins/tablePlugin.js";

let mode = "edit"; // two modes 'edit' or 'display'

import { positionIds } from "./tutorial-setup-4-posrow.js";
import { benchIds } from "./tutorial-setup-4-posbench.js";
import { goalieIds } from "./tutorial-setup-4-posgoal.js";
import "./tutorial-setup-4-formationedit.js";
import "./tutorial-setup-4-teamnames.js";
import "./tutorial-setup-4-eventslist.js";

// Register a function for toggleEdit to use with "click" in mark up
addClickFunction("toggleEdit", (e) => {
  const editNow = mode === "display"; // toggle mode

  toggleHide("namesInputMode");
  toggleHide("namesDisplayMode");
  changeClass(e.target.id, editNow); // Button press display

  positionIds.forEach((id) => toggleHide(id));
  benchIds.forEach((id) => toggleHide(id));
  goalieIds.forEach((id) => toggleHide(id));

  mode = editNow ? "edit" : "display"; // set new mode
});

const toggleHide = (id, className = "hide") => {
  const element = document.getElementById(id);
  const hiding = element.classList.contains(className);
  if (hiding) {
    element.classList.remove(className);
  } else {
    element.classList.add(className);
  }
};

//helper function for changing class
const changeClass = (id, show, className = "edit") => {
  const element = document.getElementById(id);
  if (show) {
    element.classList.remove(className);
  } else {
    element.classList.add(className);
  }
};

const zeroPad = (n) => (n > 9 ? n : "0" + n);

const formation = (prefix = "pos-") => {
  let list = "";
  for (let x = 1; x < 21; x++) {
    const value = getByName(prefix + x);
    const display = list.length == 0 ? value : ", " + value;
    const displayValue = value ? display : "";
    list = list + displayValue;
  }
  return list;
};

const bench = () => {
  const value = formation("pos-bench-");
  return value ? ". On the Bench: " + value : "";
};

const goalie = () => {
  const value = getByName("pos-goal");
  return value ? ". Goalie: " + value : "";
};

addClickFunction("publish", () => {
  const date = new Date();
  const hh = zeroPad(date.getHours());
  const mm = zeroPad(date.getMinutes());
  const ss = zeroPad(date.getSeconds());
  const ent = {
    ok: ">",
    time: hh + ":" + mm + ":" + ss,
    event: "Formation: " + formation() + goalie() + bench(),
  };
  addRow("events", ent);
});

addClickFunction("undo", (e) => {
  const clicked = e.target;
  const row = clicked.getAttribute("row");
  if (!row) {
    return;
  }
  //crossout("events-time-", row);
  //crossout("events-event-", row);
  toggleLabel(clicked);
  const ok = document.getElementById("events-ok-" + row);
  setValue(ok, "X");
  toggleClass("events", row, "crossout");

  //  const crossouts = get("crossouts") ? get("crossouts") : [];
  //  put("crossouts", crossouts);
  // do we need to store outher stuff?
});

const crossout = (prefix, row) => {
  const id = prefix + row;
  const element = document.getElementById(id);
  if (element.classList.contains("crossout")) {
    element.classList.remove("crossout");
  } else {
    element.classList.add("crossout");
  }
};

const toggleLabel = (clicked) =>
  (clicked.innerText = clicked.innerText === "Undo" ? "Redo" : "Undo");

go();
