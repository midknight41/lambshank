import Activator from "./Activator";
import AwsBroker from "./AwsBroker";
import ConsoleLogger from "./ConsoleLogger";
import getConfig from "./ConfigManager";

// import getContainer from "./Depender";
import ExecutionContextFactory from "./ExecutionContextFactory";
import Task from "./Task";
import LoggingGroup from "./LoggingGroup";
import { LambdaBridge } from "./LambdaBridge";
import { thrower } from "check-verify";

import { IAppConfig, ILogger, IBroker, IHandler, ITask } from "./Interfaces";
import * as AWS from "aws-sdk";

let singleton = null;

export default function getCoreComponents(configFile: string): CoreFramework {

  if (singleton) return singleton;

  thrower({ configFile })
    .check("configFile").is.a.string();

  const config = getConfig(configFile);

  singleton = new CoreFramework(config);
  return singleton;

}

/*
export function getIoC() {
  return getContainer();
}
*/

export class CoreFramework {

  private broker: IBroker;
  private logger: ILogger;
  private config: IAppConfig;
  private contextFactory: ExecutionContextFactory;
  private activator: Activator;

  constructor(config: IAppConfig) {

    thrower(config)
      .check("sns.topicRoot").is.a.string();

    this.config = config;

    this.registerCoreComponents_();
  }

  private registerCoreComponents_() {

    this.logger = new ConsoleLogger();
    this.broker = new AwsBroker(new AWS.SNS(), new AWS.Lambda(), this.logger, this.config.sns.topicRoot);

    this.contextFactory = new ExecutionContextFactory(this.broker);
    this.activator = new Activator(this.broker, this.logger, this.contextFactory);

  }

  public createTask<T>(taskName: string): ITask<T> {
    return new Task(this.broker, taskName);
  }

  public getBroker(): IBroker {
    return this.broker;
  }

  public createBridge(taskName: string) {
    return new LambdaBridge(taskName, this.broker);
  }

  public getLogger(): ILogger {
    return this.logger;
  }

  public createLoggingGroup(label: string) {
    return new LoggingGroup(label);
  }

  public createComponentBuilder(label: string) {
    const group = this.createLoggingGroup(label);

    const builder = new Builder(group);

    const build = builder.build.bind(builder);

    builder.build = build;
    return builder;
  }

  public registerHandlers(handlers: IHandler<{}, {}>[]) {

    for (const handler of handlers) {
      this.activator.register(handler);
    }

  }

  public listen() {

    /*
      getIoC().registerIndex({
        "Broker": this.broker
      });
    */

  }

}

export class Builder {

  private loggingGroup;

  constructor(loggingGroup) {
    this.loggingGroup = loggingGroup;
  }

  public build(Type, ...deps) {
    return new Type(this.loggingGroup.createClassLogger(Type), ...deps);
  }

}
