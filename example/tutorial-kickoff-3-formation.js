import "./tutorial-kickoff-3-posrow.js";
import "./tutorial-kickoff-3-benchrow.js";

class Formation extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `<div class="format-grid" id="formation">
                        <player-row start=1  ></player-row>
                        <player-row start=6  ></player-row>
                        <player-row start=12 ></player-row>
                        <player-row start=18 ></player-row>
                        <span class="play-grid">
                          <div class="player"></div>
                          <div class="player"></div>
                          <button click="scored" class="player-but" name="pos-goal" id="player-goal-button"></button>
                          <div></div>
                          <div></div>
                        </span>
                        <player-bench></player-bench>
                      </div>`;
  }
}
customElements.define("players-formation", Formation);
