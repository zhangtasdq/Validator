import ExecutorInterface from "../interface/ExecutorInterface";

class GroupExecutor implements ExecutorInterface {
    readonly name:string;
    private childrens:ExecutorInterface[];
    private executor: (children: ExecutorInterface[]) => boolean;

    constructor(name:string, executor: (children: ExecutorInterface[]) => boolean) {
        this.name = name;
        this.executor = executor;
    }

    execute():boolean  {
        return this.executor(this.childrens);
    }

    addChild(executorItem: ExecutorInterface) {
        this.childrens.push(executorItem);
    }
}

export default GroupExecutor;
