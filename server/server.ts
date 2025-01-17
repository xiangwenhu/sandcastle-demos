import Activity from "sanddunes/dist/activities/Activity";
import manager from "./case";
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
                case "caseList":
                    sendCaseList(ws as any);
                    break;
                case "start":
                    startCaseInstance(ws as any, data.id);
                    break;
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


const converter = new ObjectJSONConverter()

function sendCaseList(ws: WebSocket) {

    let instance = createInstance();

    ws.send(
        JSON.stringify({
            type: "caseList",
            data: manager.toList().map(c => {

                const copy = {
                    ...c,
                }
                copy.activityConfig = JSON.parse(converter.toJSON(c.activityConfig))

                return ({
                    ...copy,
                    progress: pm.getProgress(instance.createActivity(c.activityConfig))
                })
            }),
        })
    );
}

function startCaseInstance(ws: WebSocket, id: string) {

    const caseA = manager.getCase(id);
    if (!caseA) return;

    let actInstance: Activity<any, any, any>;
    if (caseA.instances && caseA.instances.length > 0) {
        actInstance = caseA.instances[0];
        const progress = pm.getProgress(actInstance);

        ws.send(JSON.stringify({
            type: 'progress',
            data: {
                id,
                progress
            }
        }))
    } else {
        let instance = createInstance();
        actInstance = instance.createActivity(caseA.activityConfig);
        caseA.instances = caseA.instances || [];
        caseA.instances.push(actInstance);

        actInstance.run().then(res => {
            ws.send(JSON.stringify({
                type: "result",
                data: {
                    type: caseA.activityConfig.type,
                    name: caseA.name,
                    data: res
                }
            }))
        }).finally(function () {
            const caseA = manager.getCase(id);
            if (caseA?.instances) {
                caseA.instances.length = 0;
            }
        });
    }

    actInstance.messenger?.on("status", function (status: EnumActivityStatus, act: any) {
        // console.log( act.type, act.name, ACTIVITY_STATUS_MAP[status])
        const progress = pm.getProgress(actInstance);

        ws.send(JSON.stringify({
            type: 'progress',
            data: {
                id,
                progress
            }
        }))
    });

}

function startCaseByConfig(ws: WebSocket, caseItem: CaseItem) {

    let instance = createInstance();
    let actInstance = instance.createActivity(caseItem.activityConfig);

    actInstance.run().then(res => {
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

    actInstance.messenger?.on("status", function (status: EnumActivityStatus, act: any) {
        const progress = pm.getProgress(actInstance);

        ws.send(JSON.stringify({
            type: 'progress',
            data: {
                id: caseItem.id,
                progress
            }
        }))
    });
}