import { CaseItem } from "./case/CaseManager";

import { wss } from "./wss";
import { createInstance, EnumActivityStatus, ObjectJSONConverter } from "sanddunes";
import pm from "sanddunes/dist/progress/index"

wss.on("connection", function (ws) {
    ws.on("message", (buffer) => {
        try {
            const jsonData = JSON.parse(buffer.toString());
            const { type, data } = jsonData;
            switch (type) {
                case "startByConfig":
                    startCaseByConfig(ws as any, data);
                    break;
                case "getFlowTree":
                    getFlowTree(ws as any, data)
                    break;
                default:
                    break;
            }
        } catch (err: any) {
            console.error("message error", err);
            ws.send(JSON.stringify({
                type: "error",
                data: err && err.message
            }))
        }
    })
});


function startCaseByConfig(ws: WebSocket, caseItem: CaseItem) {

    const config = eval(caseItem.sourceText!);
    let instance = createInstance(config);


    function onStatus(status: EnumActivityStatus, act: any) {
        const progress = pm.getProgress(instance.activity!);

        ws.send(JSON.stringify({
            type: 'progress',
            data: {
                id: caseItem.id,
                progress
            }
        }))
    }

    instance.run().then(res => {
        ws.send(JSON.stringify({
            type: "result",
            data: {
                type: config.type,
                name: caseItem.name,
                data: res
            }
        }))
    }).catch((err: any) => {
        console.log("instance.run error", err)
        ws.send(JSON.stringify({
            type: "error",
            data: err && err.message
        }))
    }).finally(() => {
        instance.messenger!.off("status", onStatus);
        // @ts-ignore
        instance = null;
    })

    instance.messenger?.on("status", onStatus);
}


function getFlowTree(ws: WebSocket, caseItem: CaseItem) {
    const config = eval(caseItem.sourceText!);
    let instance = createInstance(config);
    const progress = pm.getProgress(instance.activity!);
    ws.send(JSON.stringify({
        type: 'getFlowTree',
        data: {
            id: caseItem.id,
            progress
        }
    }))
}