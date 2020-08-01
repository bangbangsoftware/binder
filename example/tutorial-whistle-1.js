import "./tutorial-kickoff-4.js";
import { publish, currentScore } from "./tutorial-kickoff-2.js";
import { addClickFunction, setByName, getByName } from "./dist/binder.js";

addClickFunction("reset", () => {
  setByName("mins", "00");
  setByName("secs", "00");
});

addClickFunction("finalWhistle", () => {
  const place = getByName("place");
  const score = currentScore();
  // publish
  publish(
    "The final whistle has blown! " + "At " + place.toLowerCase() + " " + score
  );
  // csv
  // reset
  // done
});
