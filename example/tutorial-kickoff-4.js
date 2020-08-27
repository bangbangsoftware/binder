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
  const event = document.getElementById("events-details-" + row);
  const crossout = event.classList.contains("crossout");
  const adujster = crossout ? -1 : 1;
  const eventText = getValue(event);
  const scoreIndex = eventText.indexOf("scored");
  const scored = scoreIndex > -1;
  const conceded = eventText.indexOf("conceded") > -1;
  if (!scored && !conceded) {
    return; // no score to change
  }
  if (scored) {
    const scorer = eventText.substring(0, scoreIndex - 1);
    const scorerLabel = scorer + "-scored";
    const currentGoals = parseInt(getByName(scorerLabel)) + adujster;
    setByName(scorerLabel, currentGoals);
  }

  const name = conceded ? "opponentScore" : "score";
  const score = getByName(name);
  const newScore = parseInt(score) + adujster;
  setByName(name, newScore);
});
