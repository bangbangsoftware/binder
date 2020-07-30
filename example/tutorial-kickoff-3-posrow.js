import { getByName } from "./dist/binder.js";

class PlayerRow extends HTMLElement {
  start = -1;
  constructor() {
    super();
    this.start = parseInt(this.getAttribute("start"));
  }

  connectedCallback() {
    for (let x = 0; x < 6; x++) {
      const id = this.start + x;
      const html = `<div class="player">
                      <button if="pos-${id}" class="hide player-but" click="scored" name="pos-${id}" id="player-button-${id}"></button>
                    </div>`;
      this.innerHTML = this.innerHTML + html;
    }
    this.innerHTML = `<span class="play-grid">` + this.innerHTML + `</span>`;
  }
}

customElements.define("player-row", PlayerRow);
