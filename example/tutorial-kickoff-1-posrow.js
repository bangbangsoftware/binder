import { getByName } from "./dist/index.js";

class PlayerRow extends HTMLElement {
  start = -1;
  constructor() {
    super();
    this.start = parseInt(this.getAttribute("start"));
  }

  connectedCallback() {
    for (let x = 1; x < 6; x++) {
      const id = this.start + x;
      const player = getByName("pos-" + id);
      const playerHTML = `<button click="scored" name="pos-${id}" id="player-button-${id}">${player}</button>`;
      const gapHTML = `<label click="scored" name="gap-${id}" id="gap-${id}"></label>`;
      const html = player ? playerHTML : gapHTML;
      this.innerHTML = this.innerHTML + html;
    }
    this.innerHTML = `<span class="row-grid">` + this.innerHTML + `</span>`;
  }
}

customElements.define("player-row", PlayerRow);
