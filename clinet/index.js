const ws = new WebSocket("ws://127.0.0.1:8080");

ws.onerror = console.error;

ws.onopen = function () {
    console.log("open....");
};

ws.onmessage = function message(ev) {
    console.log("received: %s", ev.data);
};
