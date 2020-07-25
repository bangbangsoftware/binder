import "./tutorial-kickoff-1-posrow.js";
import "./tutorial-kickoff-1-benchrow.js";

class Formation extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const goalie = getByName("pos-goal");
    this.innerHTML = `<div class="format-grid" id="formation">
                        <player-row start=1  ></player-row>
                        <player-row start=6  ></player-row>
                        <player-row start=11 ></player-row>
                        <player-row start=16 ></player-row>
                        <button name="pos-goal" id="player-goal-button"></button>
                        <player-bench></player-bench>
                      </div>`;
  }
}
customElements.define("players-formation", Formation);
