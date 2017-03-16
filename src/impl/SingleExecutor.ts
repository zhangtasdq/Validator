import ExecutorInterface from "../interface/ExecutorInterface";

class SingleExecutor implements ExecutorInterface {
    readonly name:string;
    private rule:Object;

    constructor(name:string, rule:Object) {
        this.name = name;
        this.rule = rule;
    }

    execute():boolean {
        return true;
    }
}

export default SingleExecutor;
