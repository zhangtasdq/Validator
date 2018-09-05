import ExecutorResult from "../interface/ExecutorResult";
import ExecutorInterface from "../interface/ExecutorInterface";
import Operator from "./Operator";
import {SingleRuleInterface} from "../interface/SingleRuleInterface";

class SingleExecutor implements ExecutorInterface {
    readonly name:string;
    private rule:SingleRuleInterface;
    private operator:Operator;

    constructor(name:string, rule:SingleRuleInterface, operator:Operator) {
        this.name = name;
        this.rule = rule;
        this.operator = operator;
    }

    private getObjValueByPath(target:Object, path:string):any {
        path = path.replace(/\[(\w+)\]/, ".$1");
        path = path.replace(/^\./, "");

        let pathArray = path.split("."),
            tempTarget = target,
            i = 0,
            j = pathArray.length;

        for(; i < j; ++i) {
            let key = pathArray[i];

            if (tempTarget.hasOwnProperty(key)) {
                tempTarget = tempTarget[key];
            } else {
                break;
            }
        }

        if (i === pathArray.length) {
            return tempTarget;
        }
        return null;
    }

    private getCurrentValue(current:Object):any  {
        let value = this.getObjValueByPath(current, this.rule.key);
        return value;
    }

    private getTargetValue(target:Object):any {
        if (!this.rule.targetType || this.rule.targetType === "plainValue") {
            return this.rule.targetValue;
        }
        return this.getObjValueByPath(target, this.rule.targetValue);
    }

    execute(current:Object, contextData:Object):ExecutorResult {
        let currentValue = this.getCurrentValue(current),
            targetValue = this.getTargetValue(contextData);

        if (this.operator.run(currentValue, targetValue)) {
            return {status: true};
        }
        return {status: false, errorMsg: this.rule.errorMsg};
    }
}

export default SingleExecutor;
