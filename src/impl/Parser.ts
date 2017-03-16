import ExecutorInterface from "../interface/ExecutorInterface";
import ExecutorFactory from "./ExecutorFactory";
import OperatorFactory from "./OperatorFactory";

class Parse {
    private executorFactory: ExecutorFactory;
    private operatorFactory: OperatorFactory;

    parse(rule:Object):ExecutorInterface {
        let result,
            keys = Object.keys(rule);

        if(keys.length === 1) {
            result = this.parseGroup(keys[0], rule[keys[0]]);
        } else {
            result = this.parseSingle(rule);
        }
        return result;
    }

    parseGroup(key:string, rule:Object[]):ExecutorInterface {
        let executor = this.executorFactory.buildGroupExecutor(key);

        for(let i = 0, j = rule.length; i < j; ++i) {
            executor.addChild(this.parse(rule[i]));
        }

        return executor;
    }

    parseSingle(rule:any):ExecutorInterface {
        let operator = this.operatorFactory.getOperator(rule.operator);
        return this.executorFactory.buildSingleExecutor(rule, operator);
    }

    setExecutorFactory(executorFactory:ExecutorFactory):void {
        this.executorFactory = executorFactory;
    }

    setOperatorFactory(operatorFactory:OperatorFactory):void {
        this.operatorFactory = operatorFactory;
    }
}

export default Parse;
