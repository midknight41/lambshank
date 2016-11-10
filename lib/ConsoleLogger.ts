/* tslint:disable:no-console */
import { ILogger } from "./Interfaces";
import * as Q from "q";

export default class ConsoleLogger implements ILogger {

  private display: boolean;

  constructor(display: boolean = true) {
    this.display = display;
  }

  public trace(...params) { if (this.display) console.log("trace", params); }
  public info(...params) { if (this.display) console.log("info", params); }
  public error(...params) { if (this.display) console.log("error", params); }
  public debug(...params) { if (this.display) console.log("debug", params); }
  public warn(...params) { if (this.display) console.log("warn", params); }

  public logAndReject(methodId: string, message: any, data: any, error?: Error): Q.Promise {

    if (error == null) {
      error = message;
      message = "unhandled exception";
    }

    this.error(methodId, message, { error });
    return Q.reject(error);
  }

  public logAndResolve(methodId: string, message: string, data?: any): Q.Promise {

    this.info(methodId, message);
    return Q.resolve(data);
  }

}
