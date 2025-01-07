import { IActivityConfig } from "sandcastle";
import Activity from "sandcastle/dist/activities/Activity";

export interface CaseItem {
    id: string;
    name: string;
    activityConfig: IActivityConfig;
    instances?: Activity<any, any, any>[];
}

export default class CaseManager {
    #caseMap = new Map<string, CaseItem>();

    addCase(caseItem: CaseItem) {
        caseItem.instances = [];
        this.#caseMap.set(caseItem.id, caseItem);
    }

    toList() {
        return [...this.#caseMap.values()];
    }

    getCase(id: string) {
        return this.#caseMap.get(id);
    }
}
