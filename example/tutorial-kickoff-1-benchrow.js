import { getByName } from "./dist/index.js";

class PlayerBench extends HTMLElement {
  start = -1;
  constructor() {
    super();
    this.start = parseInt(this.getAttribute("start"));
  }

  connectedCallback() {
    for (let id = 1; id < 6; id++) {
      const player = getByName("pos-bench-" + id);
      const playerHTML = `<button click="scored" name="pos-bench-${id}" id="player-button-${id}">${player}</button>`;
      const gapHTML = `<label click="scored" name="gap-${id}" id="gap-${id}"></label>`;
      const html = player ? playerHTML : gapHTML;
      this.innerHTML = this.innerHTML + html;
    }
    this.innerHTML = `<span class="row-grid">` + this.innerHTML + `</span>`;
  }
}

customElements.define("player-bench", PlayerBench);
