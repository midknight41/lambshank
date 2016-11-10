import {ILogger} from "./Interfaces";

export default function createTracer(className: string) {
  return new Tracer(className);
}

export class Tracer {

  private className: string;

  constructor(className: string) {
    this.className = className;
  }

  public createProxy(target, logger: ILogger, methods: string[], props: string[] = []): any {

    const me = this;

    const proxy = {};

    // proxy methods
    for (const methodName of methods) {

      proxy[methodName] = function (...params) {
        logger.trace(`${me.className}.${methodName}`, "called", { params });
        return target[methodName].apply(target, params);
      };

    }

    // copy properties
    for (const propName of props) {

      proxy[propName] = target[propName];

    }

    return proxy;

  }

}
