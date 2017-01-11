import {EventEmitter} from "events";
import { CheckVerify } from "check-verify";
import * as Q from "q";

export interface IAppConfig {
  aws: IAwsConfig;
  sns: ISnsConfig;
}

export interface IHandler<Request, Response> {
  name: string;
  success: string;
  failure: string;
  handler(context: IContext<Request, Response>);
}

export interface IAwsConfig {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
}

export interface ISnsConfig {
  topicRoot: string;
}

export interface IContextValidator {
  a: IContextValidator;
  an: IContextValidator;
  that: IContextValidator;
  is: IContextValidator;
  object(name: string): void;
  function(name: string): void;
  array(name: string): void;
  string(name: string): void;
  url(name: string): void;
}

export interface IContext<Request, Response> {
  check(field: string): CheckVerify<Q.Promise<any>>;
  finish(message: Response);
  fail(error: Error, message);
  // expect: IContextValidator;
  execute(executionCode: (payload: Request) => Q.Promise<any>);
}


export interface IExpectation {
  method: string;
  name: string;
}

export interface ITask<T> {
  invoke(msg: T): Q.Promise<any>;
}

export interface IBroker extends EventEmitter {
  broadcast(eventName: string, msg: any);
  processMessage(eventName: string, msg: Object, callback: (err, data) => void);
  invoke(eventName: string, msg: Object): Q.Promise<any>;
}

export interface ILogger {
  debug(method: string, message: string, meta?: any);
  error(method: string, message: string, meta?: any);
  info(method: string, message: string, meta?: any);
  trace(method: string, message: string, meta?: any);
  logAndReject(methodId: string, message: any, data: any, err: Error): Q.Promise<any>;
  logAndResolve(methodId: string, message: string, data?: any): Q.Promise<any>;
  warn(method: string, message: string, meta?: any);

}

export interface IAdvancedLogger extends ILogger {
  createTraceProxy(target, methods: string[], props?: string[]): any;
}

