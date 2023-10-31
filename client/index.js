const ws = new WebSocket("ws://127.0.0.1:8080");

ws.onerror = console.error;

ws.onopen = function () {
    console.log("open....");
};

ws.onmessage = function message(ev) {
    if (typeof ev.data !== "string") return;
    console.log("received: %s", ev.data);
    const data = JSON.parse(ev.data);
    switch (data.type) {
        case "caseList":
            renderCaseList(data.data);
            break;
        case "progress":
            break;
        case "startResult":
            break;
        default:
            break;
    }
};

function renderCaseList(caseList) {
    const listHtml = caseList
        .map(
            (item) =>
                `<li class='case-item' data-id=${item.id}>${item.name}</li>`
        )
        .join("");

    const ul = document.createElement("ul");
    ul.innerHTML = listHtml;
    ul.addEventListener("click", (ev) => {
        console.log("ev.data:", ev);
        if (ev.target.tagName == "LI") {
        }
    });

    root.appendChild(ul);
}

function renderActTree() {}
