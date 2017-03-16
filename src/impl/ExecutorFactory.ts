import ExecutorResult from "../interface/ExecutorResult";
import ExecutorInterface from "../interface/ExecutorInterface";
import GroupExecutor from "./GroupExecutor";
import SingleExecutor from "./SingleExecutor";
import Operator from "./Operator";
import {SingleRuleInterface} from "../interface/SingleRuleInterface";

let andExecutor = (children: ExecutorInterface[], target:Object, contextData: Object) => {
    let result = {status: true};

    for(let i = 0, j = children.length; i < j; ++i) {
        result = children[i].execute(target, contextData);
        if (!result.status) {
            break;
        }
    }
    return result;
};

let orExecutor = (children: ExecutorInterface[], target:Object, contextData:Object) => {
    let itemResult = null;

    for(let i = 0, j = children.length; i < j; ++i) {
        itemResult = children[i].execute(target, contextData);

        if (itemResult.status) {
            break;
        }
    }
    return itemResult;
};

class GroupExecutorFactory {
    private groupExecutors: Object;

    constructor() {
        this.groupExecutors = {};
        this.addGroupExecutor("and", andExecutor);
        this.addGroupExecutor("or", orExecutor);
    }

    private groupExecutorBuilder(name:string, executor: (children: ExecutorInterface[], target:Object, contextData:Object) => ExecutorResult):typeof GroupExecutor {
        return class extends GroupExecutor {
            constructor() {
                super(name, executor);
            }
        }
    }

    addGroupExecutor(name:string, executor: (children: ExecutorInterface[], target:Object, contextData:Object) => ExecutorResult):void {
        this.groupExecutors[name] = this.groupExecutorBuilder(name, executor);
    }

    buildSingleExecutor(rule:any, operator:Operator):SingleExecutor {
        rule = <SingleRuleInterface> rule;
        return new SingleExecutor("singleExecutor", rule, operator);
    }

    buildGroupExecutor(name:string):GroupExecutor {
        let Group = this.groupExecutors[name];
        if (!Group) {
            throw new Error(`组 ${name} 不存在!`);
        }
        return new Group();
    }
}

export default GroupExecutorFactory;
