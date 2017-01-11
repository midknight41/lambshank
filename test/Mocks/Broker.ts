import * as Q from "q";

import { EventEmitter } from "events";
import { IBroker, ILogger } from "../../lib/Interfaces";

export default class Broker extends EventEmitter implements IBroker {
  public broadcast(eventName: string, msg: any): Q.Promise<any> {
    this.emit(eventName, msg);
    return Q.resolve(msg);
  }

  processMessage(eventName: string, msg: Object, callback: (err, data) => void) {
    this.emit(eventName, msg, callback);
  }

  invoke(eventName: string, msg: Object) {
    return null;
  }

  public attachLogger(logger: ILogger) {
    return;
  }
}
