class FormationEdit extends HTMLElement {
  mode = "edit";
  constructor() {
    super();
    this.mode = this.getAttribute("mode");
  }

  connectedCallback() {
    this.innerHTML = `<div class="format-grid" id="formation">
                        <pos-row   mode="${this.mode}" start=1  > </pos-row>
                        <pos-row   mode="${this.mode}" start=6  ></pos-row>
                        <pos-row   mode="${this.mode}" start=11 ></pos-row>
                        <pos-row   mode="${this.mode}" start=16 ></pos-row>
                        <pos-goal  mode="${this.mode}"></pos-goal>
                        <pos-bench mode="${this.mode}"></pos-bench>
                      </div>`;
  }
}
customElements.define("formation-edit", FormationEdit);
