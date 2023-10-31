import clearValue from "./clearValue";
import CaseManager from "./CaseManager";

const manager = new CaseManager();

manager.addCase({
    id: "1",
    name: "clearValue",
    activity: clearValue,
});


export default manager;

