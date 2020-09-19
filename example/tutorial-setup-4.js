import { addClickFunction, getByName, setByName } from "./dist/binder.js";
import { addRow, toggleClass, clearTable } from "./dist/plugins/tablePlugin.js";

import { positionIds } from "./tutorial-setup-4-posrow.js";
import { benchIds } from "./tutorial-setup-4-posbench.js";
import { goalieIds } from "./tutorial-setup-4-posgoal.js";
import "./tutorial-setup-4-formationedit.js";
import "./tutorial-setup-4-teamnames.js";
import "./tutorial-setup-4-eventslist.js";

let mode = "edit"; // two modes 'edit' or 'display'

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
    const display = list.length == 0 ? value : ". " + value;
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

const location = () => {
  const place = getByName("place");
  return (" (" + place).toLowerCase() + ").";
};

addClickFunction("publish", () => {
  publish("Formation: " + formation() + goalie() + bench() + location());
});

const publish = (details) => {
  const date = new Date();
  const hh = zeroPad(date.getHours());
  const mm = zeroPad(date.getMinutes());
  const ss = zeroPad(date.getSeconds());
  const ent = {
    ok: ">",
    time: hh + ":" + mm + ":" + ss,
    details,
  };
  addRow("events", ent);
};

const getRow = (e) => {
  const clicked = e.target;
  return clicked.getAttribute("row");
};

addClickFunction("kickoff", (e) => {
  setByName("lastUpdate", new Date().getTime()); // reset for pause
  window.location.href = "tutorial-kickoff-4.html";
});

addClickFunction("undo", (e) => {
  const row = getRow(e);
  if (!row) {
    return;
  }
  toggleClass("events", row, "crossout");
});

export const reset = () => {
  clearTable("events");
  setByName("mins", "00");
  setByName("secs", "00");
  setByName("oppenentName", "");
  setByName("opponentScore", "0");
  setByName("score", "0");
  zeroPlayersScores();
};

const zeroPlayersScores = (pos = 1) => {
  if (pos > 22) {
    return;
  }
  zeroPlayerScore(pos);
  zeroPlayersScores(pos + 1);
};

const zeroPlayerScore = (pos) => {
  const name = getByName("pos-" + pos);
  if (!name) {
    return;
  }
  const scorer = name + "-scored";
  setByName(scorer, 0);
};

addClickFunction("send", async (e) => {
  const row = getRow(e);
  if (!row) {
    return;
  }
  const title = "Footswell";
  const text = document.getElementById("events-details-" + row).innerText;
  const url = window.location.href;
  //  you could..... const number = telephoneNumber;

  if (!navigator.share) {
    console.error("web share not supported");
    return;
  }

  try {
    await navigator.share({
      title,
      text,
      url,
    });
    console.log("Thanks for sharing!");
  } catch (err) {
    console.log(`Couldn't share because of`, err.message);
  }
  /** 
    
   Straight to WhatsApp?

    const  message =  encodeURIComponent(yourMessage);
    
    console.log("https://api.whatsapp.com/send?phone=" + number + "&text=%20" + message);
    return fetch("https://api.whatsapp.com/send?phone=" + number + "&text=%20" + message);
  
  */
});
