import createContextCallback from "./LambdaContext";
// import getIoC from "./Depender";
import { IBroker } from "./Interfaces";
import { thrower } from "check-verify";

export class LambdaBridge {

  private eventName_ = "";
  private broker: IBroker;

  constructor(eventName: string, broker: IBroker) {

    thrower({ eventName, broker })
      .check("eventName").is.a.string()
      .check("broker").is.an.object();

    this.eventName_ = eventName;
    this.broker = broker;

  }

  public handler(eventPayload: Object, context) {

    thrower({ eventPayload, context })
      .check("eventPayload").is.an.object()
      .check("context").is.an.object();

    // const broker: IBroker = getIoC().resolve("Broker");
    this.broker.processMessage(this.eventName_, eventPayload, createContextCallback(context));

  }
/*
  public createHandler(lambdaMessage, context) {

    // const broker: IBroker = getIoC().resolve("Broker");
    this.broker.processMessage(this.eventName_, lambdaMessage, createContextCallback(context));

  }
*/

}

export default function getBridgeInstance(event) {

  // const broker: IBroker = getIoC().resolve("Broker");
  return new LambdaBridge(event, this.broker);

}
