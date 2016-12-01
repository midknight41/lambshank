// Testing Framework
import * as Code from "code";
import * as Lab from "lab";
import * as sinon from "sinon";
import * as Q from "q";
import getHelper from "lab-testing";

import AwsBroker from "../lib/AwsBroker";
import * as MockAws from "./Mocks/MockAws";
import MockLogger from "./Mocks/Logging";

const lab = exports.lab = Lab.script();
const expect = Code.expect;
const testing = getHelper(lab);

const method = testing.createExperiment("Lambshank", "AwsBroker");

/*
testing.willThrow.methodParameterTest()
testing.willReject.methodParameterTest()
testing.willSatisfy(result => result.success === false).methodParameterTest()
*/

method("constructor", () => {

  const topicRoot = "arn:aws:sns:eu-west-1:625894027313";
  const sns = new MockAws.SNS();
  const lambda = new MockAws.Lambda();

  const logger = new MockLogger();
  const broker = new AwsBroker(sns, lambda, logger, topicRoot);

  testing.standardContructorTest(AwsBroker, ["sns", "lambda", "logger", "topicRoot"], sns, lambda, logger, topicRoot);

});
/*
method("broadcast", () => {

  const topicRoot = "arn:aws:sns:eu-west-1:625894027313";
  const sns = new MockAws.SNS();
  const lambda = new MockAws.Lambda();

  const logger = new MockLogger();
  const broker = new AwsBroker(sns, lambda, logger, topicRoot);

  testing.methodParameterTest(broker, broker.broadcast, ["event", "message"], "eventName", {});

});
*/

method("broadcast", () => {

  let topicRoot: string;
  let sns: MockAws.SNS;
  let lambda: MockAws.Lambda;

  let logger: MockLogger;
  let broker: AwsBroker;
  let stub: Sinon.SinonStub;

  lab.before(done => {

    topicRoot = "arn:aws:sns:eu-west-1:625894027313";
    sns = new MockAws.SNS();
    lambda = new MockAws.Lambda();

    logger = new MockLogger();
    broker = new AwsBroker(sns, lambda, logger, topicRoot);
    done();

  });

  lab.afterEach(done => {
    stub.restore();
    done();
  });

  lab.test("Correctly routes a message to SNS", done => {

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

  lab.test("SNS throws an unexpected error", done => {

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

});

/*
method("invoke", () => {

  const topicRoot = "arn:aws:sns:eu-west-1:625894027313";
  const sns = new MockAws.SNS();
  const lambda = new MockAws.Lambda();

  const logger = new MockLogger();
  const broker = new AwsBroker(sns, lambda, logger, topicRoot);

  testing.methodParameterTest(broker, broker.invoke, ["event", "message"], "eventName", {});

});
*/

method("invoke", () => {

  let topicRoot: string;
  let sns: MockAws.SNS;
  let lambda: MockAws.Lambda;

  let logger: MockLogger;
  let broker: AwsBroker;
  let stub: Sinon.SinonStub;

  lab.before(done => {

    topicRoot = "arn:aws:sns:eu-west-1:625894027313";
    sns = new MockAws.SNS();
    lambda = new MockAws.Lambda();

    logger = new MockLogger();
    broker = new AwsBroker(sns, lambda, logger, topicRoot);
    done();

  });

  lab.afterEach(done => {
    stub.restore();
    done();
  });

  lab.test("Correctly calls AWS Lambda", done => {

    const msg = { url: "http://www.chadmacey.co.uk" };
    const taskName = "Task-For-Test";

    const testParams = {
      FunctionName: "Task-For-Test",
      Payload: JSON.stringify(msg)
    };

    stub = sinon.stub(lambda, "invoke", (params, callback) => {
      expect(params).to.equal(testParams);

      const response = {
        StatusCode: 200,
        Payload: JSON.stringify({ success: true })
      }

      callback(null, response);
    });

    return broker.invoke(taskName, msg)
      .then(result => {
        expect(result).to.be.an.object();
        expect(result.success).to.be.true();
      })
      .catch(err => {
        Code.fail(`unexpected error: ${err.message}`);
      });
  });

  lab.test("AWS Lambda throws on an unexpected error", done => {

    const msg = { url: "http://www.chadmacey.co.uk" };
    const taskName = "Task-For-Test";

    const testParams = {
      FunctionName: "Task-For-Test",
      Payload: JSON.stringify(msg)
    };

    const error = new Error("ERROR");

    stub = sinon.stub(lambda, "invoke", (params, callback) => {
      expect(params).to.equal(testParams);
      callback(error, null);
    });

    return broker.invoke(taskName, msg)
      .then(result => {

        Code.fail(`unexpected success: ${result}`);
      })
      .catch(err => {
        Code.fail(`unexpected error: ${err.message}`);
      });
  });

});

// const invokeGroup: nodeunit.ITestGroup = {
//   "Correctly call a Lambda function": function (test: nodeunit.Test): void {

//     const deps = getGoodDependencies();

//     const msg = { url: "http://www.chadmacey.co.uk" };

//     const testParams = {
//       FunctionName: "Task-For-Test",
//       Payload: JSON.stringify(msg)
//     };

//     gently.expect(deps.lambda, "invoke", (params, cb) => {

//       test.notEqual(params, null, "params are null");
//       test.deepEqual(params, testParams, "params failed deep equal");

//       const response = {
//         StatusCode: 200,
//         Payload: JSON.stringify({ test: true })
//       }

//       cb(null, response);

//     });

//     deps.broker.invoke(testParams.FunctionName, msg)
//       .then(result => {

//         test.notEqual(result, null);
//         test.equal(result.test, true);
//         test.done();
//       })
//       .catch(err => {
//         test.equal(true, false);
//       })
//       .done();
//   },
//   "Reject if task name is null": function (test: nodeunit.Test): void {
//     const deps = getGoodDependencies();

//     const msg = { url: "http://www.chadmacey.co.uk" };

//     deps.broker.invoke(null, msg)
//       .then(result => {
//         test.equal(true, false, "unexpected success");
//       })
//       .catch(err => {
//         test.notEqual(err, null);
//         test.done();
//       })
//       .done();

//   },
//   "Reject if task name is undefined": function (test: nodeunit.Test): void {
//     const deps = getGoodDependencies();

//     const msg = { url: "http://www.chadmacey.co.uk" };

//     deps.broker.invoke(undefined, msg)
//       .then(result => {
//         test.equal(true, false, "unexpected success");
//       })
//       .catch(err => {
//         test.notEqual(err, null);
//         test.done();
//       })
//       .done();

//   },
//   "Reject if task name is an empty string": function (test: nodeunit.Test): void {
//     const deps = getGoodDependencies();

//     const msg = { url: "http://www.chadmacey.co.uk" };

//     deps.broker.invoke(null, msg)
//       .then(result => {
//         test.equal(true, false, "unexpected success");
//       })
//       .catch(err => {
//         test.notEqual(err, null);
//         test.done();
//       })
//       .done();

//   },
//   "Reject if message is null": function (test: nodeunit.Test): void {
//     const deps = getGoodDependencies();

//     const msg = { url: "http://www.chadmacey.co.uk" };

//     deps.broker.invoke("Task-Name", null)
//       .then(result => {
//         test.equal(true, false, "unexpected success");
//       })
//       .catch(err => {
//         test.notEqual(err, null);
//         test.done();
//       })
//       .done();

//   },
//   "Reject if message is undefined": function (test: nodeunit.Test): void {
//     const deps = getGoodDependencies();

//     const msg = { url: "http://www.chadmacey.co.uk" };

//     deps.broker.invoke("Task-Name", undefined)
//       .then(result => {
//         test.equal(true, false, "unexpected success");
//       })
//       .catch(err => {
//         test.notEqual(err, null);
//         test.done();
//       })
//       .done();

//   }
// }

// const processMessageGroup: nodeunit.ITestGroup = {
//   "Can correctly route a message": function (test: nodeunit.Test): void {

//     const deps = getGoodDependencies();

//     const msg = { url: "http://www.chadmacey.co.uk" };

//     const eventName = "Task-For-Test";

//     const callback = function (err, data) {

//     };

//     deps.broker.on(eventName, (data, cb) => {
//       test.deepEqual(data, msg, "messages are not same");
//       test.equal(cb, callback);
//       test.done();
//     });

//     deps.broker.processMessage(eventName, msg, callback);



//   },
//   "Throw if task name is null": function (test: nodeunit.Test): void {
//     const deps = getGoodDependencies();

//     const msg = { url: "http://www.chadmacey.co.uk" };

//     test.throws(() => {
//       deps.broker.processMessage(null, msg, (err, data) => {

//       });

//     });

//     test.done();

//   },
//   "Throw if task name is undefined": function (test: nodeunit.Test): void {
//     const deps = getGoodDependencies();

//     const msg = { url: "http://www.chadmacey.co.uk" };

//     test.throws(() => {
//       deps.broker.processMessage(undefined, msg, (err, data) => {

//       });

//     });

//     test.done();

//   },
//   "Throw if task name is an empty string": function (test: nodeunit.Test): void {
//     const deps = getGoodDependencies();

//     const msg = { url: "http://www.chadmacey.co.uk" };

//     test.throws(() => {
//       deps.broker.processMessage("", msg, (err, data) => {

//       });

//     });

//     test.done();
//   },
//   "Throw if message is null": function (test: nodeunit.Test): void {
//     const deps = getGoodDependencies();

//     const msg = { url: "http://www.chadmacey.co.uk" };

//     test.throws(() => {
//       deps.broker.processMessage("Task-Name", null, (err, data) => {

//       });

//     });

//     test.done();

//   },
//   "Throw if message is undefined": function (test: nodeunit.Test): void {
//     const deps = getGoodDependencies();

//     const msg = { url: "http://www.chadmacey.co.uk" };

//     test.throws(() => {
//       deps.broker.processMessage("Task-Name", undefined, (err, data) => {

//       });

//     });

//     test.done();
//   }
// }


// function getGoodDependencies() {

//   const topicRoot = "arn:aws:sns:eu-west-1:625894027313";
//   const sns = new MockAws.SNS();
//   const lambda = new MockAws.Lambda();

//   const logger = new MockLogger();
//   const broker = new AwsBroker(sns, lambda, logger, topicRoot);

//   return { topicRoot, sns, lambda, broker };

// }

// exports.broadcast = broadcastGroup;
// exports.invoke = invokeGroup;
// exports.processMessage = processMessageGroup;
