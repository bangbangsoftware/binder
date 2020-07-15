export const goalieIds = [];

class PosGoal extends HTMLElement {
  start = -1;
  constructor() {
    super();
    this.start = parseInt(this.getAttribute("start"));
  }

  connectedCallback() {
    const buttonclass = this.mode === "edit" ? "" : "hide";
    const inputclass = this.mode === "edit" ? "hide" : "";
    const html =
      `<button swap-data="pswap" class="place ${buttonclass}" name="pos-goal" id="pos-goal-button"></button>` +
      `<input placeholder="Goalie" class="place ${inputclass}" name="pos-goal" id="pos-goal-input"></input>`;
    this.innerHTML = this.innerHTML + html;
    goalieIds.push("pos-goal-input");
    goalieIds.push("pos-goal-button");
    this.innerHTML = `<span>` + this.innerHTML + `</span>`;
  }
}
customElements.define("pos-goal", PosGoal);
