import { getByName, setByName } from "./dist/binder.js";

class ScoreClock extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `<div class="clock-grid" id="scoreGrid">
                        <label class="teamName" id="scoreLabel" name="score" ></label>
                        <span class="clock" id="clock">
                          <div id="mins" name="mins" class="time"></div>:<div id="secs" name="secs" class="time"></div>
                        </span>
                        <label class="teamName" id="opponentScoreLabel" name="opponentScore" ></label>
                      </div>`;
  }
}

customElements.define("score-clock", ScoreClock);
