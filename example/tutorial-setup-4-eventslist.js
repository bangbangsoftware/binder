class EventsList extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `<div class="events-grid" id="formation">
                        <h2>Fix</h2>
                        <h2>Time</h2>
                        <h2>Event</h2>
                        <h2>Send</h2>
                      </div>
                      <div class="events-grid" table="events">
                        <button class="event-button" click="undo">Undo</button>
                        <div class="event-text" place="time"></div>
                        <div class="event-text" place="event"></div>
                        <button class="event-button" click="send">send</div>
                      </div>`;
  }
}
customElements.define("events-list", EventsList);
console.log("events-list defined");
