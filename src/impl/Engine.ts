import EngineInterface from "../interface/EngineInterface";
import ExecutorInterface from "../interface/ExecutorInterface";
import ExecutorFactory from "./ExecutorFactory";
import ExecutorResult from "../interface/ExecutorResult";
import Parser from "./Parser"
import OperatorFactory from "./OperatorFactory";

class Engine implements EngineInterface {
    private executorFactory: ExecutorFactory;
    private currentRule:{[key:string]: ExecutorInterface};
    private parser:Parser;
    private contextData:Object;
    private operatorFactory:OperatorFactory;

    constructor(contextData = {}) {
        this.executorFactory = new ExecutorFactory();
        this.operatorFactory = new OperatorFactory();
        this.parser = new Parser();
        this.contextData = contextData;
        this.currentRule = {};
    }

    addRule(key:string, rule:Object) {
        this.parser.setExecutorFactory(this.executorFactory);
        this.parser.setOperatorFactory(this.operatorFactory);
        this.currentRule[key] = this.parser.parse(rule);
    }

    run(key:string, target:Object, successCallback: () => any, errorCallback?:(result:Object) => any) {
        let executor = this.currentRule[key];
        if (!executor) {
            throw new Error(`规则 ${key} 不存在!`);
        }
        let result = executor.execute(target, this.contextData);
        if (result.status) {
            successCallback();
        } else if(errorCallback){
            errorCallback(result);
        }
    }

    addGroupExecutor(key:string, executor: (children: ExecutorInterface[], target:Object, contextData:Object) => ExecutorResult) {
        this.executorFactory.addGroupExecutor(key, executor);
    }
}

export default Engine;
