import { getByName } from "./dist/binder.js";

class PlayerBench extends HTMLElement {
  start = -1;
  constructor() {
    super();
    this.start = parseInt(this.getAttribute("start"));
  }

  connectedCallback() {
    for (let id = 1; id < 6; id++) {
      const html = `<div class="player">
                      <button if="pos-bench-${id}" name="pos-bench-${id}" id="bench-button-${id}"
                      class="player-but" click="scored" ></button>
                    </div>`;
      this.innerHTML = this.innerHTML + html;
    }
    this.innerHTML = `<span class="row-grid">` + this.innerHTML + `</span>`;
  }
}

customElements.define("player-bench", PlayerBench);
