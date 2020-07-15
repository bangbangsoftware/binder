class TeamNames extends HTMLElement {
  constructor() {
    super();
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
