import CaseManager from "./CaseManager";
import clearValue from "./clearValue";
import search from "./search";
import ifElse from "./ifElse";

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


manager.addCase({
    id: "3",
    name: "IFEsle",
    activityConfig: ifElse
})


export default manager;

