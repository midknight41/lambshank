import { thrower } from "check-verify";
import * as Q from "q";
import { IAdvancedLogger } from "./Interfaces";

export default class LoggingGroup {

  private groupName: string;
  private display: boolean;

  constructor(groupName: string, display: boolean = true) {

    thrower({ groupName, display })
      .check("groupName").is.a.string()
      .check("display").is.a.boolean();

    this.groupName = groupName;
    this.display = display;

  }

  createClassLogger(theClass: any) {
    return new ClassLogger(this.groupName, theClass.name, this.display);
  }

}

export class ClassLogger implements IAdvancedLogger {

  private groupName: string;
  private className: string;
  private display: boolean;

  constructor(groupName: string, className: string, display: boolean = true) {

    thrower({ groupName, className, display })
      .check("groupName").is.a.string()
      .check("className").is.a.string()
      .check("display").is.a.boolean();

    this.groupName = groupName;
    this.className = className;
    this.display = display;
  }

  public trace(...params) { this.logIt("TRACE", params); }
  public info(...params) { this.logIt("INFO", params); }
  public error(...params) { this.logIt("ERROR", params); }
  public debug(...params) { this.logIt("DEBUG", params); }
  public warn(...params) { this.logIt("WARN", params); }

  private logIt(label: string, params) {

    params[0] = `${this.groupName}.${this.className}.${params[0]}`;

    /* tslint:disable:no-console */
    if (this.display) console.log(label, params);
    /* tslint:enable:no-console */
  }

  public logAndReject(methodId: string, message: any, data: any, error?: Error): Q.Promise<any> {

    if (error == null) {
      error = message;
      message = "unhandled exception";
    }

    this.error(methodId, message, { error });
    return Q.reject(error);
  }

  public logAndResolve(methodId: string, message: string, data?: any): Q.Promise<any> {

    this.info(methodId, message);
    return Q.resolve(data);
  }

  public createTraceProxy(target, methods: string[], props: string[] = []): any {

    const me = this;

    const proxy = {};

    // proxy methods
    for (const methodName of methods) {

      proxy[methodName] = function (...params) {
        me.trace(methodName, "called", { params });
        return target[methodName].apply(target, params);
      };

    }

    // TODO: define properties that map to the internal object
    // copy properties

    for (const propName of props) {

      proxy[propName] = target[propName];

    }

    return proxy;

  }

}
