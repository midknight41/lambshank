/* tslint:disable:no-console */
import { ILogger, IAdvancedLogger } from "../../lib/Interfaces";
import * as Q from "q";

let display = false;

export default class MockLogger implements ILogger, IAdvancedLogger {
  trace(...params) { if (display) console.log("trace", params); }
  info(...params) { if (display) console.log("info", params); }
  error(...params) { if (display) console.log("ml.error", params); }
  debug(...params) { if (display) console.log("debug", params); }
  warn(...params) { if (display) console.log("warn", params); }

  public logAndReject(methodId: string, message: any, data: any, err?: Error): Q.Promise {

    if (err == null) {
      err = message;
      message = "unhandled exception";
    }

    this.error(methodId, message, { error: err });
    return Q.reject(err);
  }

  public logAndResolve(methodId: string, message: string, data?: any): Q.Promise {

    this.info(methodId, message);
    return Q.resolve(data);
  }

  public createTraceProxy(target, methods: string[], props: string[] = []): any {
    return target;
  }

}
