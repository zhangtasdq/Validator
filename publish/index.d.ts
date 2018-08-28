export as namespace RuleValidator;

export = RuleValidator;

declare class RuleValidator {
    addOperator(operatorName: string, fn: any): void;
    addRule(ruleName: string, rule: any): void;
    run(ruleName: string, data: any, successCallback: any, errorCallback: any): void;
    addGroupExecutor(executorName: string, fn: any): void;
}
