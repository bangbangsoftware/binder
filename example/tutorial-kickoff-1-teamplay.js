class TeamPlay extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `<div class="center-grid" id="namesDisplayMode">
                        <button click="scored" class="teamName" id="teamNameLabel" name="teamName" ></button>
                        <div class="vrs">- VRS -</div>
                        <button click="opponentScored" class="teamName" id="opponentLabel" name="opponentName" ></button>
                      </div>`;
  }
}

customElements.define("team-play", TeamPlay);
