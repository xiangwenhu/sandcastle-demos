import CaseManager from "./CaseManager";
import clearValue from "./baiduHot";
import search from "./ks-search";
import ifElse from "./ifElse";

const manager = new CaseManager();

manager.addCase({
    id: "1",
    name: "badiHot",
    title: "百度热搜（页面节点解析)",
    activityConfig:   clearValue
});

manager.addCase({
    id: "2",
    name:"ksSearch",
    title: "快手搜索美女",
    activityConfig: search
});


manager.addCase({
    id: "3",
    name: "IFElse",
    title: "IFEsle",
    activityConfig: ifElse
})


export default manager;

