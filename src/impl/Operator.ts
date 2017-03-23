import OperatorInterface from "../interface/OperatorInterface";

class Operator implements OperatorInterface {
   readonly name:string;
   private executor: (currentValue:any, targetValue) => boolean;

   constructor(name:string, executor: (currentValue:any, targetValue:any) => boolean) {
       this.name = name;
       this.executor = executor;
   }

    run(currentValue:any, targetValue:any):boolean {
        return this.executor(currentValue, targetValue);
    }
}

export default Operator;
