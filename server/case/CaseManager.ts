import Activity from "../../../thief/src/activities/Activity";

interface CaseItem {
    id: string;
    name: string;
    activity: Activity<any, any, any, any, any>;
}

export default class CaseManager {
    #caseMap = new Map<string, CaseItem>();

    addCase(caseItem: CaseItem) {
        this.#caseMap.set(caseItem.id, caseItem);
    }

    toList() {
        return [...this.#caseMap.values()];
    }

    getCase(id: string) {
        return this.#caseMap.get(id);
    }
}
