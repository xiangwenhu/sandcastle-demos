import clearValue from "./clearValue";
import CaseManager from "./CaseManager";


const manager = new CaseManager();

manager.addCase({
    id: "1",
    name: "clearValue",
    activityConfig: clearValue
});


export default manager;

