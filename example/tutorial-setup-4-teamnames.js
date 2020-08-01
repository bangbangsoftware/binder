import { getByName } from "./dist/binder.js";

class TeamNames extends HTMLElement {
  constructor() {
    super();
    this.mode = this.getAttribute("mode");
  }

  connectedCallback() {
    const labelClasses =
      this.mode === "play" ? "center-grid" : "center-grid hide";
    const inputClasses =
      this.mode === "edit" ? "center-grid" : "center-grid hide";
    this.innerHTML = `<div class="${inputClasses}" id="namesInputMode">
                        <input id="teamNameInput" name="teamName" Placeholder="Team Name"></input>
                        <div class="vrs"> VRS </div>
                        <input id="opponentInput" name="opponentName" Placeholder="Opponent Name"></input>
                      </div>  
                      <div class="${labelClasses}" id="namesDisplayMode">
                        <label class="teamName" id="teamNameLabel" name="teamName" ></label>
                        <div class="vrs">- VRS -</div>
                        <label class="teamName" id="opponentLabel" name="opponentName" ></label>
                      </div>`;
  }
}
customElements.define("team-names", TeamNames);
