import { progressFactory } from "../scripts/progressFactory.mjs";

// 代码编辑器
var codeEditor = ace.edit("editor");
codeEditor.setTheme("ace/theme/monokai");
codeEditor.session.setMode("ace/mode/javascript");

// websocket
const ws = new WebSocket(`ws://${location.hostname}:8080`);
ws.onerror = console.error;
ws.onopen = function () {
  console.log("open....");
};
ws.onmessage = function message(ev) {
  if (typeof ev.data !== "string") return;
  const data = JSON.parse(ev.data);
  console.log(data);
  switch (data.type) {
    case "progress":
      renderProgress(data.data.progress, data.data.id);
      break;
    case "result":
      renderResult(data.data);
      break;
    case "getFlowTree":
      renderProgress(data.data.progress, data.data.id);
      break;
    case "error":
      renderError(data.data);
      break;
    default:
      break;
  }
};

export function renderCaseList(caseList) {
  const listHtml = caseList
    .map(
      (item) => `<li class='case-item' data-id=${item.id}>${item.title}</li>`
    )
    .join("");

  const ul = document.createElement("ul");
  ul.innerHTML = listHtml;
  ul.addEventListener("click", (ev) => {
    console.log("ev.data:", ev);
    if (ev.target.tagName == "LI") {
      const id = ev.target.dataset.id;
      renderActTree(id);
    }
  });

  cases.appendChild(ul);
}

async function fetchCaseItem(caseItem) {
  try {
    const name = caseItem.name;
    const content = await fetch(`./cases/${name}.js`).then((res) => res.text());
    return content;
  } catch (err) {
    console.log("fetchCaseItem err:", err);
  }
}

async function renderActTree(id) {
  const caseItem = caseList.find((c) => c.id == id);
  if (!caseItem) return;

  if (!caseItem.activityConfig) {
    const content = await fetchCaseItem(caseItem);
    const activityConfig = eval(content.trim().replace(/(;)$/, ""));
    caseItem.sourceText = content;
    caseItem.activityConfig = activityConfig;
  }

  renderConfigContent(caseItem);

  // renderProgress(caseItem);
  ws.send(
    JSON.stringify({
      type: "getFlowTree",
      data: caseItem,
    })
  );
}

function renderProgress(act, id) {
  const htmlStr = progressFactory.build(act);
  document.querySelector("#progress").innerHTML = `
        <div data-id=${id} class='p-root'>${htmlStr}</div>
    `;
}

function renderConfigContent(caseItem) {
  codeEditor.setValue(caseItem.sourceText);
}

btnRun.addEventListener("click", () => {
  const pRoot = document.querySelector(".p-root");
  if (!pRoot) return;
  const id = pRoot.dataset.id;
  const caseItem = caseList.find((c) => c.id == id);
  if (!caseItem) return alert("未找到对应的case");

  if (document.querySelectorAll(".ace_error").length > 0) {
    return alert("请先修复语法错误");
  }

  try {
    const data = {
      ...caseItem,
      sourceText: codeEditor.getValue(),
    };
    delete data.activityConfig;

    ws.send(
      JSON.stringify({
        type: "startByConfig",
        data,
      })
    );
    clearResult();
  } catch (err) {
    message.innerHTML = err && err.message;
  }
});

btnUpdateFlow.addEventListener("click", () => {
  const pRoot = document.querySelector(".p-root");
  if (!pRoot) return;
  const id = pRoot.dataset.id;
  const caseItem = caseList.find((c) => c.id == id);
  if (!caseItem) return alert("未找到对应的case");

  ws.send(
    JSON.stringify({
      type: "getFlowTree",
      data: caseItem,
    })
  );
});

function clearResult() {
  message.innerHTML = "";
}

const resultHandlerMap = {
  __default__(data) {
    if (typeof data == "object") {
      return JSON.stringify(data.data, undefined, "\t");
    }

    return data.data;
  },
};

function renderResult(data) {
  const result = (resultHandlerMap[data.name] || resultHandlerMap.__default__)(
    data
  );
  message.innerHTML = result;
}

function renderError(data) {
  message.innerHTML = `<div class="red">${data}</div>` + message.innerHTML;
}

(async function () {
  renderCaseList(caseList);
})();
