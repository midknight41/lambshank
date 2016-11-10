import * as Q from "q";
import { IContext, IContextValidator, IHandler, IBroker } from "./Interfaces";
import { thrower, promiser, CheckVerify } from "check-verify";

export default class ExecutionContext<Request, Response> implements IContext<Request, Response> {

  // public expect: IContextValidator;
  public payload: Request;

  private broker: IBroker;
  private taskHandler: IHandler<Request, Response>;
  private callback: (err, data) => void;
  private checker: CheckVerify<Q.Promise>;

  constructor(broker: IBroker, taskHandler: IHandler<Request, Response>, payload: Request, callback: (err, data) => void) {

    thrower({ broker, taskHandler, payload, callback })
      .check("broker").is.an.object()
      .check("taskHandler").is.an.object()
      .check("payload").is.an.object()
      .check("callback").is.a.function();

    this.broker = broker;
    this.taskHandler = taskHandler;
    this.payload = payload;
    this.callback = callback;

    this.checker = promiser();

  }

  public check(field: string): CheckVerify<Q.Promise> {

    return this.checker.check(field);
  }

  public finish(message: Response) {

    this.broker.broadcast(this.taskHandler.success, message)
      .finally(() => {
        return this.callback(null, message);
      });
  }

  public fail(error: Error, message) {
    this.broker.broadcast(this.taskHandler.failure, message)
      .finally(() => {
        return this.callback(error, null);
      });
  }

  public execute(executionCode: (payload: any) => Q.Promise) {

    thrower()
      .check("executionCode").is.a.function()
      .verify({ executionCode });

    // validate parameters and deliver the payload
    this.checker.verify(this.payload)
      .then(() => executionCode(this.payload))
      .catch(error => {
        this.fail(error, "failed parameter validation");
      })
      .done();

    /*
        trap(
          () => {
            this.expectationLog.validate(this.payload);
          },
          () => {
            return executionCode(this.payload);
          }).catch(error => {
            this.fail(error, "failed parameter validation");
          })
          .done();
    
    */

  }

}
