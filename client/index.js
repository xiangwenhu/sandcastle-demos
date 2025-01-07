const ws = new WebSocket("ws://127.0.0.1:8080");

ws.onerror = console.error;

ws.onopen = function () {
    console.log("open....");
};

let caseList = [];
ws.onmessage = function message(ev) {
    if (typeof ev.data !== "string") return;
    const data = JSON.parse(ev.data);
    console.log(data);
    switch (data.type) {
        case "caseList":
            caseList = data.data;
            renderCaseList(data.data);
            break;
        case "progress":
            // debugger;
            renderProgress(data.data.progress, data.data.id)
            break;
        case "startResult":
            break;
        case "result":
            renderResult(data.data);
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
            const id = ev.target.dataset.id;
            renderActTree(id)
        }
    });

    root.appendChild(ul);
}

function renderActTree(id) {
    const actConfig = caseList.find(c => c.id == id);
    if (!actConfig) return;
    renderProgress(actConfig.progress, id);

}

function renderProgress(act, id) {
    const htmlStr = progressFactory.build(act);
    document.querySelector("#progress").innerHTML = `
        <div data-id=${id} class='p-root'>${htmlStr}</div>
    `

}


btnRun.addEventListener("click", () => {
    const pRoot = document.querySelector(".p-root");
    if (!pRoot) return;
    const id = pRoot.dataset.id;
    ws.send(JSON.stringify({
        type: "start",
        data: {
            id
        }
    }))
    clearResult();
})

function clearResult() {
    message.innerHTML = ''
}

function renderResult(data) {
    message.innerHTML = JSON.stringify(data);
}