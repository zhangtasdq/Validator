import ExecutorInterface from "../interface/ExecutorInterface";
import GroupExecutor from "./GroupExecutor";
import SingleExecutor from "./SingleExecutor";

let andExecutor = (children: ExecutorInterface[]) => {
    return children.every((executor) => executor.execute());
};

let orExecutor = (children: ExecutorInterface[]) => {
    return children.some((executor) => executor.execute());
};

class GroupExecutorFactory {
    private groupExecutors: Object;

    constructor() {
        this.addGroupExecutor("and", andExecutor);
        this.addGroupExecutor("or", orExecutor);
    }

    private groupExecutorBuilder(name:string, executor: (children: ExecutorInterface[]) => boolean):typeof GroupExecutor {
        class ExecutorSubClass extends GroupExecutor {
            constructor() {
                super(name, executor);
            }
        }
        return ExecutorSubClass;
    }

    addGroupExecutor(name:string, executor: (children: ExecutorInterface[]) => boolean):void {
        this.groupExecutors[name] = this.groupExecutorBuilder(name, executor);
    }

    buildSingleExecutor(rule:Object):SingleExecutor {
        return new SingleExecutor("singleExecutor", rule);

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
