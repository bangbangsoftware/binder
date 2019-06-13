import { bagItAndTagIt, put, setValue, getValue } from "./dist/index.js";
import { swapperPlugin } from "./dist/plugins/swapperPlugin.js";
import { togglePlugin } from "./dist/plugins/togglePlugin.js";
import { showHidePlugin, showHideSwap } from "./dist/plugins/showhidePlugin.js";
import {
  moverPlugin,
  moverValue,
  moverCallback
} from "./dist/plugins/moverPlugin.js";
import { ifPlugin } from "./dist/plugins/ifPlugin.js";
import { swapPlugin, action } from "./dist/plugins/swapPlugin.js";

moverValue("Captain");
moverCallback(() => {
  showHideSwap("capshow");
});

const findLast = () => {
  const swapids = [
    "slot-one-butt-data",
    "slot-two-butt-data",
    "slot-three-butt-data",
    "slot-four-butt-data"
  ];
  const found = swapids
    .map(id => document.getElementById(id))
    .filter(el => {
      if (el == null) {
        return false;
      }
      const value = el.innerText;
      console.log("VALUE IS ------" + value + "======");
      return value != null && value.length > 0;
    });

  console.log("FOUND ", found);
  return found.length === 0 ? null : found[0];
};

let lastCaptian = null;
action({
  id: "captain-butt",
  callback: element => {
    console.log(element.id + " ACTION clicked");
    if (lastCaptian == null) {
      lastCaptian = findLast();
    }
    const ribbonID = element.id + "-data";
    const ribbonElement = document.getElementById(element.id + "-data");
    console.log(ribbonID + ", element is ", ribbonElement);
    setValue(ribbonElement, "- Captain -");
    put(ribbonElement);
    if (lastCaptian != null) {
      setValue(lastCaptian, "");
      put(lastCaptian);
    }
    lastCaptian = ribbonElement;
  }
});

console.log("TESTER");

bagItAndTagIt([
  swapperPlugin,
  togglePlugin,
  showHidePlugin,
  moverPlugin,
  ifPlugin,
  swapPlugin
]);

const incrementSeconds = (minutes, seconds) => {
  seconds.innerText = 0;
  const mins = parseInt(minutes.innerText) + 1;
  if (mins < 10) {
    minutes.innerText = "0" + mins;
  }
  minutes.innerText = mins;
  seconds.classList.add("red");
  minutes.classList.add("red");
};

const increment = () => {
  const seconds = document.getElementById("seconds");
  const minutes = document.getElementById("minutes");
  const secs = parseInt(seconds.innerText) + 1;
  if (secs > 59) {
    incrementSeconds(minutes, seconds);
    return;
  }
  seconds.innerText = secs < 10 ? `0${secs}` : secs;
};

const zeroFill = i => {
  if (i < 10) {
    return "0" + i;
  }
  return i;
};

const timeFormat = () => {
  const date = new Date();
  const hr = zeroFill(date.getHours());
  const mn = zeroFill(date.getMinutes());
  return `${hr}:${mn}`;
};

const main = document.getElementById("results");

const results = what => {
  const time = document.createElement("div");
  time.innerText = what.time;
  const event = document.createElement("div");
  event.innerText = what.event;
  const row = document.createElement("div");
  row.classList.add("results");
  row.classList.add("result");
  row.appendChild(time);
  row.appendChild(event);
  main.appendChild(row);
};

const kickoff = document.getElementById("kickoff");
let running;
kickoff.addEventListener("click", e => {
  e.target.style.display = "none";
  document.getElementById("playing").classList.remove("hide");
  document.getElementById("bench").classList.add("hide");
  document.getElementById("kickoff").classList.remove("hide");
  document.getElementById("state").classList.remove("hide");
  const time = timeFormat();
  results({ time, event: "Kick off" });
  running = setInterval(increment, 1000);
  const scoreLabel = document.getElementById("score");
  scoreLabel.innerText = "0";
  const vrsScoreLabel = document.getElementById("vrsScore");
  vrsScoreLabel.innerText = "0";
});

const state = document.getElementById("state");
state.addEventListener("click", e => {
  const pause = e.target.innerText === "Play On";
  if (pause) {
    document.getElementById("playing").classList.add("hide");
    document.getElementById("bench").classList.remove("hide");
    clearInterval(running);
  } else {
    running = setInterval(increment, 1000);
    document.getElementById("playing").classList.remove("hide");
    document.getElementById("bench").classList.add("hide");
  }
});

const concede = document.getElementById("vrsScore");
concede.addEventListener("click", e => {
  const el = e.target;
  el.innerText = parseInt(el.innerText) + 1;
  const time = timeFormat();
  const name = document.getElementById("opposition").value;
  results({ time, event: "Conceded a goal by " + name });
});

for (let n = 1; n < 17; n++) {
  const el = document.getElementById("position" + n);
  if (el) {
    el.addEventListener("click", e => playerScored(e));
  }
}

const playerScored = e => {
  console.log(e.target.innerText + " scored!");
  const who = e.target.innerText;
  if (!who) {
    console.log(
      e.target.name + " (" + e.target.id + ") has no player defined!"
    );
    return;
  }
  const scoreLabel = document.getElementById("score");
  scoreLabel.innerText = parseInt(scoreLabel.innerText) + 1;
  const time = timeFormat();
  results({ time, event: "Goal by " + who });
  const scored = document.getElementById("scored");
  scored.innerText = "!!! " + who + " scored !!!";
  scored.classList.remove("hide");
  put(scored);
  setTimeout(() => {
    document.getElementById("scored").classList.add("hide");
  }, 3000);
};
