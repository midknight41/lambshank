// import * as nodeunit from "nodeunit";
// import * as Q from "q";
// import MockLogger from "../../Mocks/Logging";
// import MockBroker from "../../Mocks/Broker";
// import ErrorRegistry from "../../../Core/ErrorRegistry";
// import Task from "../../../Core/Task";

// const Gently = require("gently");
// const gently = new Gently();

// const constructorGroup: nodeunit.ITestGroup = {
//   "Builds a task correct when passed valid params": function (test: nodeunit.Test): void {

//     const broker = new MockBroker();
//     const task = new Task(broker, "Task-Name");
//     test.done();
//   },
//   "Throws when passed a null broker": function (test: nodeunit.Test): void {

//     test.throws(() => {
//       const task = new Task(null, "Task-Name");
//     });
//     test.done();

//   },
//   "Throws when passed a undefined broker": function (test: nodeunit.Test): void {

//     test.throws(() => {
//       const task = new Task(undefined, "Task-Name");
//     });
//     test.done();

//   },
//   "Throws when passed a null taskName": function (test: nodeunit.Test): void {
//     const broker = new MockBroker();

//     test.throws(() => {
//       const task = new Task(broker, null);
//     });
//     test.done();
//   },
//   "Throws when passed an empty string for taskName": function (test: nodeunit.Test): void {
//     const broker = new MockBroker();

//     test.throws(() => {
//       const task = new Task(broker, null);
//     });
//     test.done();
//   },
//   "TODO: Throws when passed an invalid taskName": function (test: nodeunit.Test): void {
//     test.done();
//   }
// }

// const invokeGroup: nodeunit.ITestGroup = {
//   "Correctly call a Lambda function": function (test: nodeunit.Test): void {

//     const taskName = "Test-Task";
//     const testMessage = { url: "http://www.chadmacey.co.uk" };
//     const responseMessage = { success: true };
//     const broker = new MockBroker();
//     const task = new Task(broker, taskName);

//     gently.expect(broker, "invoke", (event, message) => {

//       test.notEqual(message, null, "message is null");
//       test.deepEqual(message, testMessage, "message failed deep equal");

//       test.notEqual(event, null, "event is null");
//       test.equal(event, taskName, "taskName failed equal");

//       return Q.resolve(responseMessage);

//     });

//     task.invoke(testMessage)
//       .then(response => {

//         test.notEqual(response, null);
//         test.deepEqual(response, responseMessage);
//         test.done();
//       })
//       .catch(error => {
//         test.equal(true, false, "unexpected error");
//       })
//       .done();
//   },
//   "A null is converted into an empty object before invoking the broker method": function (test: nodeunit.Test): void {

//     const taskName = "Test-Task";
//     const testMessage = null;
//     const responseMessage = { success: true };
//     const broker = new MockBroker();
//     const task = new Task(broker, taskName);

//     gently.expect(broker, "invoke", (event, message) => {

//       test.notEqual(message, undefined, "message is undefined");
//       test.deepEqual(message, {}, "message not converted");

//       return Q.resolve(responseMessage);

//     });

//     task.invoke(testMessage)
//       .then(response => {

//         test.notEqual(response, null);
//         test.deepEqual(response, responseMessage);
//         test.done();
//       })
//       .catch(error => {
//         test.equal(true, false, "unexpected error");
//       })
//       .done();
//   },
//   "An undefined is converted into an empty object before invoking the broker method": function (test: nodeunit.Test): void {

//     const taskName = "Test-Task";
//     const testMessage = undefined;
//     const responseMessage = { success: true };
//     const broker = new MockBroker();
//     const task = new Task(broker, taskName);

//     gently.expect(broker, "invoke", (event, message) => {

//       test.notEqual(message, null, "message is null");
//       test.deepEqual(message, {}, "message not converted");

//       return Q.resolve(responseMessage);

//     });

//     task.invoke(testMessage)
//       .then(response => {

//         test.notEqual(response, null);
//         test.deepEqual(response, responseMessage);
//         test.done();
//       })
//       .catch(error => {
//         test.equal(true, false, "unexpected error");
//       })
//       .done();
//   }

// }

// exports.constructor = constructorGroup;
// exports.invoke = invokeGroup;
