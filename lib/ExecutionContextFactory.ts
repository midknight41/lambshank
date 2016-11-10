import { IBroker, IHandler, IContext } from "./Interfaces";
import ExecutionContext from "./ExecutionContext";
import { thrower } from "check-verify";

export default class ExecutionContextFactory {

  private broker: IBroker;

  constructor(broker: IBroker) {

    thrower({ broker })
      .check("broker").is.an.object();

    this.broker = broker;
  }

  public create<Request, Response>(taskHandler: IHandler<Request, Response>, payload: Request, callback: (err, data) => void): IContext<Request, Response> {

    thrower({ taskHandler, payload, callback })
      .check("taskHandler").is.an.object()
      .check("payload").is.an.object()
      .check("callback").is.an.function();

    return new ExecutionContext<Request, Response>(this.broker, taskHandler, payload, callback);

  }

}
