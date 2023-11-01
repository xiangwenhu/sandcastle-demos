import CaseManager from "./CaseManager";
import clearValue from "./clearValue";
import search from "./search";

const manager = new CaseManager();

manager.addCase({
    id: "1",
    name: "clearValue",
    activityConfig: clearValue
});

manager.addCase({
    id: "2",
    name: "搜索结果",
    activityConfig: search
});



export default manager;

