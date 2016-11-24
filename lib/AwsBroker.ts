﻿import { EventEmitter } from "events";
import { IBroker, ILogger } from "./Interfaces";
import ErrorRegistry from "./ErrorRegistry";
import * as Q from "q";
import * as AWS from "aws-sdk";
import { thrower, promiser } from "check-verify";

const display = false;

export default class AwsBroker extends EventEmitter implements IBroker {

  private sns: AWS.SNS;
  private lambda: AWS.Lambda;
  private topicRoot: string;
  private logger: ILogger;

  constructor(sns: AWS.SNS, lambda: AWS.Lambda, logger: ILogger, topicRoot: string) {

    super();

    thrower({ sns, lambda, logger, topicRoot })
      .check("sns").is.an.object()
      .check("lambda").is.an.object()
      .check("logger").is.an.object()
      .check("topicRoot").is.an.string();

    this.sns = sns;
    this.lambda = lambda;
    this.topicRoot = topicRoot;
    this.logger = logger;

  }

  public broadcast(eventName: string, message: Object): Q.Promise {

    // Broadcast should never throw an error. We need to trap any errors.
    const methodId = "AwsBroker.broadcast";
    this.logger.info(methodId, "broadcasting", { eventName, message });

    return promiser()
      .check("eventName").is.an.string()
      .check("message").is.an.object()
      .verify({ eventName, message })
      .then(() => this.sendToSns(eventName, message))
      .then(() => Q.resolve({ success: true }))
      .catch((error: Error) => {
        this.logger.error(methodId, `broadcast failed`, { error, eventName });
        return Q.resolve({ success: false, message: error.message });
      });

  }

  public invoke(eventName: string, message: Object): Q.Promise {

    const methodId = "AwsBroker.invoke";
    this.logger.info(methodId, "invoking", { eventName, message });

    return promiser()
      .check("eventName").is.an.string()
      .check("message").is.an.object()
      .verify({ eventName, message })
      .then(() => this.callLambdaFunction(eventName, message));
  }

  public processMessage(eventName: string, message: any, callback: (err, data) => void): void {

    const methodId = "AwsBroker.processMessage";

    thrower({ eventName, message, callback })
      .check("eventName").is.an.string()
      .check("message").is.an.object()
      .check("callback").is.a.function();

    // TODO: add warning if the eventName is not registered with the broker.

    this.logger.info(methodId, "processing", { eventName, message });

    if (message.Records != null && message.Records[0] != null && message.Records[0].Sns != null && message.Records[0].Sns.Message != null) {

      // SNS message received. Decode and extract

      let extracted = message.Records[0].Sns.Message;
      extracted = this.base64Decode(extracted);

      this.logger.debug(methodId, "SNS message received and decoded.", extracted);

      this.emit(eventName, extracted, callback);
      return;

    }

    // Emit raw message
    this.emit(eventName, message, callback);

  }

  private sendToSns(eventName: string, msg: Object): Q.Promise {

    const encoded = this.base64Encode(msg);

    const params: AWS.Sns.PublishRequest = {
      Message: JSON.stringify(encoded),
      TopicArn: `${this.topicRoot}:${eventName}`
    };

    const snsPublish = Q.nbind(this.sns.publish, this.sns);
    return snsPublish(params);

  }

  private callLambdaFunction(eventName: string, msg: Object): Q.Promise {

    if (!eventName || eventName.length === 0) Q.reject(new Error(ErrorRegistry.Validation.BadRequest));
    if (msg === null) msg = {};

    const params: AWS.Lambda.InvokeParams = {
      FunctionName: eventName,
      Payload: JSON.stringify(msg)
    };

    return Q.Promise((resolve, reject) => {

      this.lambda.invoke(params, (err, data) => {
        if (err) return reject(err); // an error occurred

        try {
          const payload = JSON.parse(data.Payload);

          if (data.FunctionError) return reject(new Error(payload.errorMessage));

          return resolve(payload);

        } catch (ex) {
          return reject(ex);
        }

      });

    });

  }

  private base64Encode(unencoded) {

    return new Buffer(JSON.stringify(unencoded)).toString("base64");
  }

  private base64Decode(encoded) {

    const decodedMsg = new Buffer(encoded, "base64").toString("utf8");

    return JSON.parse(decodedMsg);
  }

}
