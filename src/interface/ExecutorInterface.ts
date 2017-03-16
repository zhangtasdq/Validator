import ExecutorResult from "./ExecutorResult";

interface ExecutorInterface {
    readonly name:string;
    execute(target:Object, contextData:Object):ExecutorResult;
};

export default ExecutorInterface;
