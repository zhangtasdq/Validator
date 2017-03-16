import ExecutorInterface from "../interface/ExecutorInterface";
import ExecutorFactory from "./ExecutorFactory";

class Parse {
    private executorFactory: ExecutorFactory;

    constructor(executorFactory: ExecutorFactory) {
        this.executorFactory = executorFactory;
    }

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

    parseSingle(rule:Object):ExecutorInterface {
        return this.executorFactory.buildSingleExecutor(rule);
    }
}

export default Parse;
