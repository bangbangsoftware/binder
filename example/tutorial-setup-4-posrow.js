export const positionIds = [];

class PosRow extends HTMLElement {
  start = -1;
  mode = "edit";
  constructor() {
    super();
    this.start = parseInt(this.getAttribute("start"));
    this.mode = this.getAttribute("mode");
  }

  connectedCallback() {
    const buttonclass = this.mode === "display" ? "" : "hide";
    const inputclass = this.mode === "edit" ? "" : "hide";
    for (let x = 0; x < 5; x++) {
      const id = this.start + x;
      const html =
        `<button swap-data="pswap" class="${buttonclass}" name="pos-${id}" id="pos-button-${id}"></button>` +
        `<input class="${inputclass}" name="pos-${id}" id="pos-input-${id}"></input>`;
      this.innerHTML = this.innerHTML + html;
      positionIds.push("pos-input-" + id);
      positionIds.push("pos-button-" + id);
    }
    this.innerHTML = `<span class="row-grid">` + this.innerHTML + `</span>`;
  }
}

customElements.define("pos-row", PosRow);
