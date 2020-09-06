import "./tutorial-kickoff-4.js";
import { publish, currentScore } from "./tutorial-kickoff-2.js";
import { addClickFunction, setByName, getByName } from "./dist/binder.js";
import { rowsWithoutClass } from "./dist/plugins/tablePlugin.js";

addClickFunction("reset", () => {
  setByName("mins", "00");
  setByName("secs", "00");
});

addClickFunction("finalWhistle", () => {
  const score = currentScore();
  // publish
  publish("The final whistle has blown!, " + score);
  const scorers = getPlayersScores();
  if (scorers) {
    publish("Our goals scored -  " + scorers);
  }
  // csv
  download();
});

const getPlayersScores = (pos = 1, scorers = "") => {
  if (pos > 22) {
    return scorers;
  }
  const playerScore = getPlayerScore(pos);
  const div = scorers.length > 0 ? ", " : "";
  const newScores = playerScore ? scorers + div + playerScore : scorers;
  return getPlayersScores(pos + 1, newScores);
};

const getPlayerScore = (pos) => {
  const player = getByName("pos-" + pos);
  if (!player) {
    return;
  }
  const scorer = player + "-scored";
  const score = parseInt(getByName(scorer));
  if (!score) {
    return;
  }
  return player + ": " + score;
};

addClickFunction("newGame", () => {
  window.location = "./tutorial-setup-4.html";
});

const download = () => {
  const date = new Date();

  let data = "";
  const rows = rowsWithoutClass("events", "crossout").sort((a, b) =>
    a.time > b.time ? 1 : a.time < b.time ? -1 : 0
  );
  rows.forEach((evt) => {
    data = data + evt.time + ", " + evt.details + "\n";
  });
  const filename = date + ".csv";
  const type = "csv";
  const file = new Blob([data], { type });
  if (window.navigator.msSaveOrOpenBlob) {
    // IE10+
    window.navigator.msSaveOrOpenBlob(file, filename);
    return;
  }
  // Others
  const a = document.createElement("a");

  const url = URL.createObjectURL(file);
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 0);
};
