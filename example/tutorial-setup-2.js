import "./dist/go.js";
import { addClickFunction, go } from "./dist/index.js";

class TeamNames extends HTMLElement {
  mode = "exit";

  constructor() {
    super();
    this.mode = this.getAttribute("mode");
  }

  connectedCallback() {
    this.innerHTML = `<div class="center" id="namesInputMode">
                        <input id="teamNameInput" name="teamName" Placeholder="Team Name"></input>
                        VRS
                        <input id="opponentInput" name="opponentName" Placeholder="Opponent Name"></input>
                      </div>  
                      <div class="hide center" id="namesDisplayMode">
                        <label id="teamNameLabel" name="teamName" ></label>
                        - VRS -
                        <label id="opponentLabel" name="opponentName" ></label>
                      </div>`;
  }
}
customElements.define("team-names", TeamNames);

addClickFunction("toggleEdit", (e) => {
  const comp = document.getElementById("teamNames");
  const mode = comp.getAttribute("mode");

  const newMode = mode === "display" ? "edit" : "display";
  const edit = newMode === "edit";
  toggle("namesInputMode", edit);
  toggle("namesDisplayMode", !edit);
  toggle(e.target.id, !edit, "edit");

  comp.setAttribute("mode", newMode);
});

const toggle = (id, show, className = "hide") => {
  const element = document.getElementById(id);
  if (show) {
    element.classList.remove(className);
  } else {
    element.classList.add(className);
  }
};

go();
