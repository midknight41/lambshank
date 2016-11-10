import {IHandler, IBroker, ILogger, IContext} from "./Interfaces";
import { thrower } from "check-verify";
import ExecutionContext from "./ExecutionContext";
import ExecutionContextFactory from "./ExecutionContextFactory";

export default class Activator {

  private broker: IBroker;
  private logger: ILogger;
  private contextFactory: ExecutionContextFactory;

  constructor(broker: IBroker, logger: ILogger, contextFactory: ExecutionContextFactory) {

    thrower({ broker, logger, contextFactory })
      .check("broker").is.a.object()
      .check("logger").is.a.object()
      .check("contextFactory").is.a.object();

    this.broker = broker;
    this.logger = logger;
    this.contextFactory = contextFactory;

  }

  public register<Request, Response>(taskHandler: IHandler<Request, Response>) {

    thrower({ taskHandler })
      .check("taskHandler.name").is.a.string()
      .check("taskHandler.failure").is.a.string()
      .check("taskHandler.success").is.a.string();

    this.broker.on(taskHandler.name, (msg, callback: (err, data) => void) => {

      const context = this.contextFactory.create<Request, Response>(taskHandler, msg, callback);

      taskHandler.handler(context);

    });

  }

}
