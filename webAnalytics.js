const tracker = document.querySelector("html");

class TrackBehaviour {
    constructor(eventTypes, post) {
        const postProcess = function () {
            eval(post);
        }

        for (let event of eventTypes) {
            this[event] = {};
            tracker.addEventListener(event, this.handleEvent.bind(this));
        }
        this.postProcess = (postProcess === undefined) ? this.beforeUnloadHandler.bind(this) : postProcess.bind(this);
        // Bind the handleEvent function reference (by default, it will assume this to be referencing the event. We want this to reference the constructor).
        window.addEventListener("beforeunload", this.postProcess);
    }

    handleEvent = function (event) {
        if (this[event.type][event.target.outerHTML] === undefined) {
            this[event.type][event.target.outerHTML] = 1;
        }
        else {
            this[event.type][event.target.outerHTML] += 1;
        }
    }

    beforeUnloadHandler = async function (event) {
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ "click events": this.click, "change events": this.change }));
        const anchor = document.createElement("a");

        anchor.setAttribute("href", dataStr);
        anchor.setAttribute("download", this.filename);

        anchor.click();
    }
}


const track = new TrackBehaviour(document.querySelector(".analyticsScript").dataset.events, document.querySelector(".analyticsScript").dataset.postprocess)