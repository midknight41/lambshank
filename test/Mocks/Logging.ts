/* tslint:disable:no-console */
import { ILogger, IAdvancedLogger } from "../../lib/Interfaces";
import * as Q from "q";

let display = false;

export default class MockLogger implements ILogger, IAdvancedLogger {
  trace(...params) { if (display) console.log("ml.trace", params); }
  info(...params) { if (display) console.log("ml.info", params); }
  error(...params) { if (display) console.log("ml.error", params); }
  debug(...params) { if (display) console.log("ml.debug", params); }
  warn(...params) { if (display) console.log("ml.warn", params); }

  public logAndReject(methodId: string, message: any, data: any, err?: Error): Q.Promise<any> {

    if (err == null) {
      err = message;
      message = "unhandled exception";
    }

    this.error(methodId, message, { error: err });
    return Q.reject(err);
  }

  public logAndResolve(methodId: string, message: string, data?: any): Q.Promise<any> {

    this.info(methodId, message);
    return Q.resolve(data);
  }

  public createTraceProxy(target, methods: string[], props: string[] = []): any {
    return target;
  }

}
