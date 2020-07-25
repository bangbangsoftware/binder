import { getByName, setByName, addClickFunction } from "./dist/binder.js";
import { addRow } from "./dist/plugins/tablePlugin.js";

import "./tutorial-setup-4.js";
import "./tutorial-kickoff-1-teamplay.js";
import "./tutorial-kickoff-2-scoreclock.js";

const getZeroValue = (name) => {
  const stored = getByName(name);
  return stored ? parseInt(stored) : 0;
};

addClickFunction("scored", () => {
  const teamName = getByName("teamName");
  const currentScore = getZeroValue("score");
  const score = currentScore + 1;
  setByName("score", score);
  console.log(teamName + " scored! Now have " + score + " goals in this game");
  scored("!!! " + teamName + " have scored !!!");
  publish(teamName + " have scored!");
});

const scored = (text) => {
  setByName("scored", text);
  document.getElementById("scored").classList.remove("hide");
  setTimeout(
    () => document.getElementById("scored").classList.add("hide"),
    3000
  );
};

addClickFunction("opponentScored", () => {
  const teamName = getByName("teamName");
  const opponentName = getByName("opponentName");
  const currentScore = getZeroValue("opponentScore");
  const score = currentScore + 1;
  setByName("opponentScore", score);
  console.log(
    opponentName + " have scored. Now have " + score + " goals in this game"
  );
  publish(teamName + " have conceded a goal. :(");
});

const zeroPad = (n) => (n > 9 ? n : "0" + n);

const clock = setInterval(() => {
  const seconds = getZeroValue("secs");
  const mins = getZeroValue("mins");
  const nextSec = seconds + 1;
  const updateMin = nextSec > 59 ? mins + 1 : mins;
  const updateSec = nextSec > 59 ? 0 : nextSec;
  setByName("secs", zeroPad(updateSec));
  setByName("mins", zeroPad(updateMin));
}, 1000);

addClickFunction("whistle", clearInterval(clock));

const publish = (event) => {
  const date = new Date();
  const hh = zeroPad(date.getHours());
  const mm = zeroPad(date.getMinutes());
  const ss = zeroPad(date.getSeconds());
  const ent = {
    time: hh + ":" + mm + ":" + ss,
    event,
  };
  addRow("events", ent);
};