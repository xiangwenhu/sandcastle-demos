import Activity from "sandcastle/dist/activities/Activity";
import manager from "./case";
import { wss } from "./wss";
import { createActivity, EnumActivityStatus } from "sandcastle";
import getProgress from "sandcastle/dist/progress/index"

wss.on("connection", function (ws) {
    ws.send(
        JSON.stringify({
            type: "caseList",
            data: manager.toList(),
        })
    );

    ws.on("message", (buffer) => {
        const jsonData = JSON.parse(buffer.toString());
        const { type, data } = jsonData;
        switch (type) {
            case "start":
                startCaseInstance(ws as any, data.id)
            default:
                break;
        }

    })
});


function startCaseInstance(ws: WebSocket, id: string) {

    const caseA = manager.getCase(id);
    if (!caseA) return;

    let instance: Activity<any, any, any>;
    if (caseA.instances && caseA.instances.length > 0) {
        instance = caseA.instances[0];
        const progress = getProgress(instance);

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
                data: res
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
        const progress = getProgress(instance);

        ws.send(JSON.stringify({
            type: 'progress',
            data: {
                id,
                progress
            }
        }))
    });
}
