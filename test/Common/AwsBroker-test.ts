// import * as nodeunit from "nodeunit";
// import * as Q from "q";
// import * as MockAws from "../../Mocks/MockAws";
// import AwsBroker from "../../../Core/AwsBroker";
// import MockLogger from "../../Mocks/Logging";
// import MongoDbMocker from "../../Mocks/MongoDB";
// import ErrorRegistry from "../../../Core/ErrorRegistry";

// const Gently = require("gently");
// const gently = new Gently();

// const broadcastGroup: nodeunit.ITestGroup = {
//   "Correctly routes a message to SNS": function (test: nodeunit.Test): void {

//     const deps = getGoodDependencies();

//     const msg = { url: "http://www.chadmacey.co.uk" };

//     const taskName = "Task-For-Test";

//     const testParams = {
//       Message: '"eyJ1cmwiOiJodHRwOi8vd3d3LmNoYWRtYWNleS5jby51ayJ9"',
//       TopicArn: 'arn:aws:sns:eu-west-1:625894027313:Task-For-Test'
//     };

//     gently.expect(deps.sns, "publish", (params, cb) => {

//       test.notEqual(params, null, "params are null");
//       test.deepEqual(params, testParams, "params failed deep equal");

//       cb(null, { test: true });

//     });


//     deps.broker.broadcast(taskName, msg)
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
//   "Should not throw and should return a failure message on a null taskName": function (test: nodeunit.Test): void {

//     const deps = getGoodDependencies();

//     const taskName = null;
//     const msg = { url: "http://www.chadmacey.co.uk" };

//     deps.broker.broadcast(taskName, msg)
//       .then(result => {
//         test.notEqual(result, null);
//         test.equal(result.success, false);
//         test.done();
//       })
//       .catch(err => {
//         test.equal(true, false);
//       })
//       .done();
//   },
//   "Should not throw and should return a failure message on a empty string for taskName": function (test: nodeunit.Test): void {

//     const deps = getGoodDependencies();

//     const taskName = "";
//     const msg = { url: "http://www.chadmacey.co.uk" };

//     deps.broker.broadcast(taskName, msg)
//       .then(result => {
//         test.notEqual(result, null);
//         test.equal(result.success, false);
//         test.done();
//       })
//       .catch(err => {
//         test.equal(true, false);
//       })
//       .done();
//   },
//   "Should not throw and should return a failure message on a undefined taskName": function (test: nodeunit.Test): void {
//     const deps = getGoodDependencies();

//     const taskName = undefined;
//     const msg = { url: "http://www.chadmacey.co.uk" };

//     deps.broker.broadcast(taskName, msg)
//       .then(result => {
//         test.notEqual(result, null);
//         test.equal(result.success, false);
//         test.done();
//       })
//       .catch(err => {
//         test.equal(true, false);
//       })
//       .done();
//   },
//   "Should not throw and should return a failure message on a null messsage": function (test: nodeunit.Test): void {
//     const deps = getGoodDependencies();

//     const taskName = "Test-Task-Name";
//     const msg = null;

//     deps.broker.broadcast(taskName, msg)
//       .then(result => {
//         test.notEqual(result, null);
//         test.equal(result.success, false);
//         test.done();
//       })
//       .catch(err => {
//         test.equal(true, false);
//       })
//       .done();

//   },
//   "Should not throw and should return a failure message on a undefined message": function (test: nodeunit.Test): void {
//     const deps = getGoodDependencies();

//     const taskName = "Test-Task-Name";
//     const msg = undefined;

//     deps.broker.broadcast(taskName, msg)
//       .then(result => {
//         test.notEqual(result, null);
//         test.equal(result.success, false);
//         test.done();
//       })
//       .catch(err => {
//         test.equal(true, false);
//       })
//       .done();
//   },

// }

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
