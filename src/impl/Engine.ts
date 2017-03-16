import EngineInterface from "../interface/EngineInterface";
import ExecutorFactory from "./ExecutorFactory";
import Parser from "./Parser"

class Engine implements EngineInterface {
    private executorFactory: ExecutorFactory;
    private currentRule:EngineInterface;
    private parser:Parser;

    constructor() {
        this.executorFactory = new ExecutorFactory();
        this.parser = new Parser(this.executorFactory);
    }

    addRule(rule:Object) {
        this.currentRule = this.parser.parse(rule);
    }
}

export default Engine;
