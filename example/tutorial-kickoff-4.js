import "./tutorial-kickoff-2.js";
import "./tutorial-kickoff-3-formation.js";
import {
  addClickFunction,
  getValue,
  getByName,
  setByName,
} from "./dist/binder.js";

// Add an extra listener to change score based on undo....
addClickFunction("undo", (e) => {
  const row = e.target.getAttribute("row");
  const event = document.getElementById("events-event-" + row);
  const eventText = getValue(event);
  const scored = eventText.indexOf("scored") > -1;
  const conceded = eventText.indexOf("conceded") > -1;
  if (!scored && !conceded) {
    return; // no score to change
  }
  const name = conceded ? "opponentScore" : "score";
  const crossout = event.classList.contains("crossout");
  const adujster = crossout ? -1 : 1;
  const score = getByName(name);
  const newScore = parseInt(score) + adujster;
  setByName(name, newScore);
});
