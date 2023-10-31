import { wss } from "./wss";
import manager from "./case";

wss.on("connection", function (ws) {
    ws.send(
        JSON.stringify({
            type: "caseList",
            data: manager.toList(),
        })
    );
});
