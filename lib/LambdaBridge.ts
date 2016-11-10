import createContextCallback from "./LambdaContext";
import getIoC from "./Depender";
import {IBroker} from "./Interfaces";

export class LambdaBridge {

  private eventName_ = "";
  private broker: IBroker;

  constructor(eventName: string, broker: IBroker) {

    this.eventName_ = eventName;
    this.broker = broker;

  }

  public handler(event, context) {

    const broker: IBroker = getIoC().resolve("Broker");
    broker.processMessage(this.eventName_, event, createContextCallback(context));

  }

  public createHandler(lambdaMessage, context) {

    const broker: IBroker = getIoC().resolve("Broker");
    broker.processMessage(this.eventName_, lambdaMessage, createContextCallback(context));

  }


}

export default function getBridgeInstance(event){

  const broker: IBroker = getIoC().resolve("Broker");
  return new LambdaBridge(event, broker);

}
