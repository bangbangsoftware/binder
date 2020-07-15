class FormationEdit extends HTMLElement {
  constructor() {
    super();
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
