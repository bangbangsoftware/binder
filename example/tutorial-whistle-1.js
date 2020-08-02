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
  // csv
  download();
});

addClickFunction("newGame", () => {
  window.location = "./tutorial-setup-4.html";
});

const download = () => {
  const date = new Date();

  let data = "";
  const rows = rowsWithoutClass("events", "crossout");
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
