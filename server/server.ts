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
                default:
                    break;
            }
        } catch (err) {
            console.error("message error", err);
        }
    })
});

const $$FuncPlaceholder = "__$$__function__$$__";
const PropertyWhitelist = ["code", "urlOrPredicate"];
const converter = new ObjectJSONConverter({
    funcPlaceholder: $$FuncPlaceholder,
    propertyWhitelist: PropertyWhitelist
})



function startCaseByConfig(ws: WebSocket, caseItem: CaseItem) {

    const config = converter.toObject(JSON.stringify(caseItem.activityConfig));
    let instance = createInstance(config);

    instance.run().then(res => {
        ws.send(JSON.stringify({
            type: "result",
            data: {
                type: caseItem.activityConfig.type,
                name: caseItem.name,
                data: res
            }
        }))
    }).catch(err => {
        console.log("instance.run error", err)
    }).finally(() => {


    })

    instance.messenger?.on("status", function (status: EnumActivityStatus, act: any) {
        const progress = pm.getProgress(instance.activity!);

        ws.send(JSON.stringify({
            type: 'progress',
            data: {
                id: caseItem.id,
                progress
            }
        }))
    });
}