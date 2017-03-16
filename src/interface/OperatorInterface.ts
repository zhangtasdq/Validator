interface OperatorInterface {
    readonly name:string;
    run(currentValue:any, targetValue:any):boolean;
}

export default OperatorInterface;
