import ExecutorResult from "../interface/ExecutorResult";
import ExecutorInterface from "../interface/ExecutorInterface";

class GroupExecutor implements ExecutorInterface {
    readonly name:string;
    private childrens:ExecutorInterface[];
    private executor: (children: ExecutorInterface[], target:Object, contextData:Object) => ExecutorResult;

    constructor(name:string, executor: (children: ExecutorInterface[], target:Object, contextData:Object) => ExecutorResult) {
        this.name = name;
        this.executor = executor;
        this.childrens = [];
    }

    execute(target:Object, contextData:Object):ExecutorResult  {
        return this.executor(this.childrens, target, contextData);
    }

    addChild(executorItem: ExecutorInterface) {
        this.childrens.push(executorItem);
    }
}

export default GroupExecutor;
