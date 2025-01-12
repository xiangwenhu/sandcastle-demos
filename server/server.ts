import Activity from "sandcastle/dist/activities/Activity";
import manager from "./case";
import { CaseItem } from "./case/CaseManager";

import { wss } from "./wss";
import { createActivity, EnumActivityStatus } from "sandcastle";
import pm from "sandcastle/dist/progress/index"

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


function sendCaseList(ws: WebSocket) {
    ws.send(
        JSON.stringify({
            type: "caseList",
            data: manager.toList().map(c => ({
                ...c,
                progress: pm.getProgress(createActivity(c.activityConfig))
            })),
        })
    );
}

function startCaseInstance(ws: WebSocket, id: string) {

    const caseA = manager.getCase(id);
    if (!caseA) return;

    let instance: Activity<any, any, any>;
    if (caseA.instances && caseA.instances.length > 0) {
        instance = caseA.instances[0];
        const progress = pm.getProgress(instance);

        ws.send(JSON.stringify({
            type: 'progress',
            data: {
                id,
                progress
            }
        }))
    } else {
        instance = createActivity(caseA.activityConfig);
        caseA.instances = caseA.instances || [];
        caseA.instances.push(instance);

        instance.run().then(res => {
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

    instance.messenger?.on("status", function (status: EnumActivityStatus, act: any) {
        // console.log( act.type, act.name, ACTIVITY_STATUS_MAP[status])
        const progress = pm.getProgress(instance);

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

    const instance = createActivity(caseItem.activityConfig);

    instance.run().then(res => {
        ws.send(JSON.stringify({
            type: "result",
            data: {
                type: caseItem.activityConfig.type,
                name: caseItem.name,
                data: res
            }
        }))
    }).catch(err=> {
        console.log("instance.run error", err)
    });

    instance.messenger?.on("status", function (status: EnumActivityStatus, act: any) {
        const progress = pm.getProgress(instance);

        ws.send(JSON.stringify({
            type: 'progress',
            data: {
                id: caseItem.id,
                progress
            }
        }))
    });
}