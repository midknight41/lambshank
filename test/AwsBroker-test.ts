// Testing Framework
import * as Code from "code";
import * as Lab from "lab";
import * as sinon from "sinon";
import * as Q from "q";
import getHelper from "lab-testing";

import ErrorRegistry from "../lib/ErrorRegistry";
import AwsBroker from "../lib/AwsBroker";
import * as MockAws from "./Mocks/MockAws";
import MockLogger from "./Mocks/Logging";

const lab = exports.lab = Lab.script();
const expect = Code.expect;
const testing = getHelper(lab);

const method = testing.createExperiment("Lambshank", "AwsBroker");

method("constructor", () => {

  const {topicRoot, sns, lambda, logger, broker} = buildDependencies();

  testing.standardContructorTest(AwsBroker, ["sns", "lambda", "logger", "topicRoot"], sns, lambda, logger, topicRoot);

});

method("broadcast()", () => {

  let sns: MockAws.SNS;
  let broker: AwsBroker;
  let stub: Sinon.SinonSpy;

  lab.beforeEach(done => {

    const deps = buildDependencies();

    sns = deps.sns;
    broker = deps.broker;

    return done();

  });

  lab.afterEach(done => {
    stub.restore();
    return done();
  });

  lab.test("correctly routes a message to SNS", done => {

    const msg = { url: "http://www.chadmacey.co.uk" };
    const taskName = "Task-For-Test";
    const expected = {
      Message: "\"eyJ1cmwiOiJodHRwOi8vd3d3LmNoYWRtYWNleS5jby51ayJ9\"",
      TopicArn: "arn:aws:sns:eu-west-1:625894027313:Task-For-Test"
    };

    stub = sinon.stub(sns, "publish", (params, callback) => {
      expect(params).to.equal(expected);
      callback(null, { "test": true });
    });

    return broker.broadcast(taskName, msg)
      .then(result => {
        expect(result).to.be.an.object();
        expect(result.success).to.be.true();
      })
      .catch(err => {
        Code.fail(`unexpected error: ${err.message}`);
      });
  });

  lab.test("should not succeed and should not throw if SNS throws an unexpected error", done => {

    const msg = { url: "http://www.chadmacey.co.uk" };
    const taskName = "Task-For-Test";
    const expected = {
      Message: "\"eyJ1cmwiOiJodHRwOi8vd3d3LmNoYWRtYWNleS5jby51ayJ9\"",
      TopicArn: "arn:aws:sns:eu-west-1:625894027313:Task-For-Test"
    };

    const error = new Error("ERROR");

    stub = sinon.stub(sns, "publish", (params, callback) => {
      expect(params).to.equal(expected);
      callback(error, null);
    });

    return broker.broadcast(taskName, msg)
      .then(result => {
        expect(result).to.be.an.object();
        expect(result.success).to.be.false();
        expect(result.message).to.equal(error.message);
      })
      .catch(err => {
        Code.fail(`unexpected error: ${err.message}`);
      });
  });

  lab.test("should not succeed and should not throw on null eventName", done => {

    const msg = { url: "http://www.chadmacey.co.uk" };
    const taskName = "Task-For-Test";

    return broker.broadcast(null, msg)
      .then(result => {
        expect(result).to.be.an.object();
        expect(result.success).to.be.false();
        expect(result.message).to.endWith("not a populated string");
      })
      .catch(err => {
        Code.fail(`unexpected error: ${err.message}`);
      });
  });

  lab.test("should not succeed and should not throw on undefined eventName", done => {

    const msg = { url: "http://www.chadmacey.co.uk" };
    const taskName = "Task-For-Test";

    return broker.broadcast(undefined, msg)
      .then(result => {
        expect(result).to.be.an.object();
        expect(result.success).to.be.false();
        expect(result.message).to.endWith("not a populated string");
      })
      .catch(err => {
        Code.fail(`unexpected error: ${err.message}`);
      });
  });

  lab.test("should not succeed and should not throw on null message", done => {

    const msg = { url: "http://www.chadmacey.co.uk" };
    const taskName = "Task-For-Test";

    return broker.broadcast(taskName, null)
      .then(result => {
        expect(result).to.be.an.object();
        expect(result.success).to.be.false();
        expect(result.message).to.endWith("not an object");
      })
      .catch(err => {
        Code.fail(`unexpected error: ${err.message}`);
      });
  });

  lab.test("should not succeed and should not throw on undefined message", done => {

    const msg = { url: "http://www.chadmacey.co.uk" };
    const taskName = "Task-For-Test";

    return broker.broadcast(taskName, undefined)
      .then(result => {
        expect(result).to.be.an.object();
        expect(result.success).to.be.false();
        expect(result.message).to.endWith("not an object");
      })
      .catch(err => {
        Code.fail(`unexpected error: ${err.message}`);
      });
  });

});

method("invoke()", () => {

  const broker = buildDependencies().broker;

  testing.rejects.methodParameterTest(broker, broker.invoke, ["eventName", "message"], "Task-For-Test", { a: "b" });

});

method("invoke()", () => {

  let lambda: MockAws.Lambda;
  let broker: AwsBroker;
  let stub: Sinon.SinonSpy;

  lab.beforeEach(done => {

    const deps = buildDependencies();

    lambda = deps.lambda;
    broker = deps.broker;

    return done();

  });

  lab.afterEach(done => {
    stub.restore();
    return done();
  });

  lab.test("correctly calls another Lambda function", done => {

    const msg = { url: "http://www.chadmacey.co.uk" };
    const expected = {
      FunctionName: "Task-For-Test",
      Payload: JSON.stringify(msg)
    };

    const internalMessage = { test: true };
    const response = {
      StatusCode: 200,
      Payload: JSON.stringify(internalMessage)
    };

    stub = sinon.stub(lambda, "invoke", (params, callback) => {
      expect(params).to.equal(expected);
      callback(null, response);
    });

    return broker.invoke(expected.FunctionName, msg)
      .then(result => {
        expect(result).to.be.an.object();
        expect(result).to.equal(internalMessage);
        return true;
      })
      .catch(err => {
        Code.fail(`unexpected error: ${err.message}`);
      });
  });

  lab.test("throws an error if remote lambda function throws an unexpected error", done => {

    const msg = { url: "http://www.chadmacey.co.uk" };
    const taskName = "Task-For-Test";
    const expected = {
      FunctionName: "Task-For-Test",
      Payload: JSON.stringify(msg)
    };

    const error = new Error("ERROR");

    stub = sinon.stub(lambda, "invoke", (params, callback) => {
      expect(params).to.equal(expected);
      callback(error, null);
    });

    return broker.invoke(taskName, msg)
      .then(result => {
        Code.fail(`unexpected success: ${result}`);
      })
      .catch(err => {
        expect(err).to.be.an.error(Error, error.message);
      });
  });

  lab.test("throws an error if remote lambda function executes successfully but returns an error", done => {

    const msg = { url: "http://www.chadmacey.co.uk" };
    const taskName = "Task-For-Test";
    const expected = {
      FunctionName: "Task-For-Test",
      Payload: JSON.stringify(msg)
    };

    const error = new Error("ERROR");
    const failureResponse = {
      FunctionError: error,
      Payload: JSON.stringify({ errorMessage: "ERROR" })
    };

    stub = sinon.stub(lambda, "invoke", (params, callback) => {
      expect(params).to.equal(expected);
      callback(null, failureResponse);
    });

    return broker.invoke(taskName, msg)
      .then(result => {
        Code.fail(`unexpected success: ${result}`);
      })
      .catch(err => {
        expect(err).to.be.an.error(Error, "ERROR");
      });
  });

  lab.test("throws an error if remote lambda function returns bad JSON", done => {

    const msg = { url: "http://www.chadmacey.co.uk" };
    const taskName = "Task-For-Test";
    const expected = {
      FunctionName: "Task-For-Test",
      Payload: JSON.stringify(msg)
    };

    const error = new Error("ERROR");
    const failureResponse = {
      FunctionError: error,
      Payload: "Oh Dear: {"
    };

    stub = sinon.stub(lambda, "invoke", (params, callback) => {
      expect(params).to.equal(expected);
      callback(null, failureResponse);
    });

    return broker.invoke(taskName, msg)
      .then(result => {
        Code.fail(`unexpected success: ${result}`);
      })
      .catch(err => {
        expect(err).to.be.an.error(SyntaxError);
      });
  });
});

method("processMessage()", () => {

  const broker = buildDependencies().broker;

  const fnc = function (err, data) {
    return;
  };

  testing.throws.methodParameterTest(broker, broker.processMessage, ["eventName", "message", "callback"], "Task-For-Test", { a: "b" }, fnc);

});

method("processMessage()", () => {

  let broker: AwsBroker;

  lab.beforeEach(done => {

    broker = buildDependencies().broker;
    return done();

  });

  lab.test("correctly calls processMessage when invoked directly", done => {

    const msg = { url: "http://www.chadmacey.co.uk" };
    const expected = {
      FunctionName: "Task-For-Test",
      Payload: JSON.stringify(msg)
    };

    const fnc = function (err, data) {
      return;
    };

    broker.on(expected.FunctionName, (data, callback) => {

      expect(data).to.equal(msg);
      expect(callback).to.equal(callback);
      return done();

    });

    broker.processMessage(expected.FunctionName, msg, fnc);

  });

  lab.test("correctly calls processMessage when invoked via SNS", done => {

    const decodedMessage = { url: "http://www.chadmacey.co.uk" };
    const snsMessage = {
      Records: [{
        Sns:
        { Message: "eyJ1cmwiOiJodHRwOi8vd3d3LmNoYWRtYWNleS5jby51ayJ9" }
      }]
    };

    const expected = {
      FunctionName: "Task-For-Test",
      Payload: JSON.stringify(snsMessage)
    };

    const fnc = function (err, data) {
      return;
    };

    broker.on(expected.FunctionName, (data, callback) => {

      expect(data).to.equal(decodedMessage);
      expect(callback).to.equal(callback);
      return done();

    });

    broker.processMessage(expected.FunctionName, snsMessage, fnc);

  });

  lab.test("throws a meaningful error when the SNS payload cannot be decoded", done => {

    const decodedMessage = { url: "http://www.chadmacey.co.uk" };
    const snsMessage = {
      Records: [{
        Sns:
        { Message: decodedMessage }
      }]
    };

    const expected = {
      FunctionName: "Task-For-Test",
      Payload: JSON.stringify(snsMessage)
    };

    const fnc = function (err, data) {
      return;
    };

    broker.on(expected.FunctionName, (data, callback) => {

      Code.fail(`event '${expected.FunctionName}' should not be raised`);
    });

    try {
      broker.processMessage(expected.FunctionName, snsMessage, fnc);

    } catch (ex) {
      expect(ex).to.be.an.error(Error, ErrorRegistry.Encoding.CannotDecode);
      return done();
    }

  });

});

function buildDependencies() {

  const topicRoot = "arn:aws:sns:eu-west-1:625894027313";
  const sns = new MockAws.SNS();
  const lambda = new MockAws.Lambda();

  const logger = new MockLogger();
  const broker = new AwsBroker(sns, lambda, logger, topicRoot);

  return { broker, lambda, logger, sns, topicRoot };

}

