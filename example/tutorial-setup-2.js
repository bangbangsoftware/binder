import { addClickFunction, go } from "./dist/index.js";

let mode = "edit"; // two modes 'edit' or 'display'

// Define custom element
class TeamNames extends HTMLElement {
  constructor() {
    super();
    mode = this.getAttribute("mode");
  }

  connectedCallback() {
    this.innerHTML = `<div class="center-grid" id="namesInputMode">
                        <input id="teamNameInput" name="teamName" Placeholder="Team Name"></input>
                        VRS
                        <input id="opponentInput" name="opponentName" Placeholder="Opponent Name"></input>
                      </div>  
                      <div class="hide center-grid" id="namesDisplayMode">
                        <label id="teamNameLabel" name="teamName" ></label>
                        - VRS -
                        <label id="opponentLabel" name="opponentName" ></label>
                      </div>`;
  }
}
customElements.define("team-names", TeamNames);

// Register a function for toggleEdit to use with "click" in mark up
addClickFunction("toggleEdit", (e) => {
  const editNow = mode === "display"; // toggle mode

  toggleClass("namesInputMode", editNow); // hide or show
  toggleClass("namesDisplayMode", !editNow); // hide or show
  toggleClass(e.target.id, !editNow, "edit"); // Button press display

  mode = editNow ? "edit" : "display"; // set new mode
});

//helper function for toggling mode
const toggleClass = (id, show, className = "hide") => {
  const element = document.getElementById(id);
  if (show) {
    element.classList.remove(className);
  } else {
    element.classList.add(className);
  }
};

go();
