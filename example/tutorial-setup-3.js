import { addClickFunction, go } from "./dist/index.js";

let mode = "edit"; // two modes 'edit' or 'display'

const posId = [];

class PosRow extends HTMLElement {
  start = -1;
  constructor() {
    super();
    this.start = parseInt(this.getAttribute("start"));
  }

  connectedCallback() {
    const buttonclass = this.mode === "edit" ? "" : "hide";
    const inputclass = this.mode === "edit" ? "hide" : "";
    for (let x = 0; x < 5; x++) {
      const id = this.start + x;
      const html =
        `<button swap-data="pswap" class="${buttonclass}" name="pos-${id}" id="pos-button-${id}"></button>` +
        `<input class="${inputclass}" name="pos-${id}" id="pos-input-${id}"></input>`;
      this.innerHTML = this.innerHTML + html;
      posId.push("pos-input-" + id);
      posId.push("pos-button-" + id);
    }
    this.innerHTML = `<span class="row-grid">` + this.innerHTML + `</span>`;
  }
}
customElements.define("pos-row", PosRow);

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
    posId.push("pos-goal-input");
    posId.push("pos-goal-button");
    this.innerHTML = `<span>` + this.innerHTML + `</span>`;
  }
}
customElements.define("pos-goal", PosGoal);

class PosBench extends HTMLElement {
  start = -1;
  constructor() {
    super();
    this.start = parseInt(this.getAttribute("start"));
  }

  connectedCallback() {
    const buttonclass = this.mode === "edit" ? "" : "hide";
    const inputclass = this.mode === "edit" ? "hide" : "";
    for (let x = 0; x < 5; x++) {
      const id = x;
      const html =
        `<button swap-data="pswap" class="${buttonclass}" name="pos-bench-${id}" id="pos-bench-button-${id}"></button>` +
        `<input placeholder="Bench #${id}" class="${inputclass}" name="pos-bench-${id}" id="pos-bench-input-${id}"></input>`;
      this.innerHTML = this.innerHTML + html;
      posId.push("pos-bench-input-" + id);
      posId.push("pos-bench-button-" + id);
    }
    this.innerHTML = `<span class="row-grid">` + this.innerHTML + `</span>`;
  }
}
customElements.define("pos-bench", PosBench);

// Define custom element
class FormationEdit extends HTMLElement {
  constructor() {
    super();
    mode = this.getAttribute("mode");
  }

  connectedCallback() {
    this.innerHTML = `<div class="format-grid" id="formation">
                        <pos-row start=1  > </pos-row>
                        <pos-row start=6  ></pos-row>
                        <pos-row start=11 ></pos-row>
                        <pos-row start=16 ></pos-row>
                        <pos-goal></pos-goal>
                        <pos-bench></pos-bench>
                      </div>`;
  }
}
customElements.define("formation-edit", FormationEdit);

// Define custom element
class TeamNames extends HTMLElement {
  constructor() {
    super();
    mode = this.getAttribute("mode");
  }

  connectedCallback() {
    this.innerHTML = `<div class="center-grid" id="namesInputMode">
                        <input id="teamNameInput" name="teamName" Placeholder="Team Name"></input>
                        <div class="vrs"> VRS </div>
                        <input id="opponentInput" name="opponentName" Placeholder="Opponent Name"></input>
                      </div>  
                      <div class="hide center-grid" id="namesDisplayMode">
                        <label class="teamName" id="teamNameLabel" name="teamName" ></label>
                        <div class="vrs">- VRS -</div>
                        <label class="teamName" id="opponentLabel" name="opponentName" ></label>
                      </div>`;
  }
}
customElements.define("team-names", TeamNames);

// Register a function for toggleEdit to use with "click" in mark up
addClickFunction("toggleEdit", (e) => {
  const editNow = mode === "display"; // toggle mode

  toggleHide("namesInputMode");
  toggleHide("namesDisplayMode");
  changeClass(e.target.id, editNow); // Button press display

  posId.forEach((id) => toggleHide(id));

  mode = editNow ? "edit" : "display"; // set new mode
});

const toggleHide = (id, className = "hide") => {
  const element = document.getElementById(id);
  const hiding = element.classList.contains(className);
  if (hiding) {
    element.classList.remove(className);
  } else {
    element.classList.add(className);
  }
};

//helper function for changing class
const changeClass = (id, show, className = "edit") => {
  const element = document.getElementById(id);
  if (show) {
    element.classList.remove(className);
  } else {
    element.classList.add(className);
  }
};

go();
