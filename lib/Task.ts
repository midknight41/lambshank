import * as Q from "q";
import { IBroker } from "./Interfaces";
import { thrower } from "check-verify";

export default class Task {
  private broker: IBroker;
  private taskName: string;

  constructor(broker: IBroker, taskName: string) {

    thrower({ broker, taskName })
      .check("broker").is.an.object()
      .check("taskName").is.a.string();

    this.broker = broker;
    this.taskName = taskName;
  }

  public invoke(message: Object): Q.Promise {

    if (message == null) message = {};

    return this.broker.invoke(this.taskName, message);

  }

}
