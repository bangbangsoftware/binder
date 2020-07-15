export const benchIds = [];

class PosBench extends HTMLElement {
  start = -1;
  constructor() {
    super();
    this.start = parseInt(this.getAttribute("start"));
  }

  connectedCallback() {
    const buttonclass = this.mode === "edit" ? "" : "hide";
    const inputclass = this.mode === "edit" ? "hide" : "";
    for (let x = 1; x < 6; x++) {
      const id = x;
      const html =
        `<button swap-data="pswap" class="${buttonclass}" name="pos-bench-${id}" id="pos-bench-button-${id}"></button>` +
        `<input placeholder="Bench #${id}" class="${inputclass}" name="pos-bench-${id}" id="pos-bench-input-${id}"></input>`;
      this.innerHTML = this.innerHTML + html;
      benchIds.push("pos-bench-input-" + id);
      benchIds.push("pos-bench-button-" + id);
    }
    this.innerHTML = `<span class="row-grid">` + this.innerHTML + `</span>`;
  }
}
customElements.define("pos-bench", PosBench);
