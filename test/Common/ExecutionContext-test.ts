// import * as nodeunit from "nodeunit";
// import * as Q from "q";

// import MockLogger from "../../Mocks/Logging";
// import MockBroker from "../../Mocks/Broker";
// import MockHandler from "../../Mocks/MockHandler";

// import { IBroker, IContext, IHandler } from "../../../Core/Interfaces";
// import ExecutionContext from "../../../Core/ExecutionContext";

// const Gently = require("gently");
// const gently = new Gently();

// const constructorGroup: nodeunit.ITestGroup = {
//   "Builds a context correctly when passed valid params": function (test: nodeunit.Test): void {

//     const broker = new MockBroker();
//     const task = new MockHandler();
//     const payload = { success: true };
//     const callback = function () { };

//     test.doesNotThrow(() => {
//       const context = new ExecutionContext(broker, task, payload, callback);
//       test.equal(context.payload, payload, "payload is not correct");
//     });

//     test.done();
//   },
//   "Throws when passed a null broker": function (test: nodeunit.Test): void {

//     const broker = null;
//     const task = new MockHandler();
//     const payload = { success: true };
//     const callback = function () { };

//     test.throws(() => {
//       const context = new ExecutionContext(broker, task, payload, callback);
//     });

//     test.done();

//   },
//   "Throws when passed a undefined broker": function (test: nodeunit.Test): void {

//     const broker = undefined;
//     const task = new MockHandler();
//     const payload = { success: true };
//     const callback = function () { };

//     test.throws(() => {
//       const context = new ExecutionContext(broker, task, payload, callback);
//     });

//     test.done();

//   },
//   "Throws when passed a null task": function (test: nodeunit.Test): void {

//     const broker = new MockBroker();
//     const task = null;
//     const payload = { success: true };
//     const callback = function () { };

//     test.throws(() => {
//       const context = new ExecutionContext(broker, task, payload, callback);
//     });

//     test.done();

//   },
//   "Throws when passed a undefined task": function (test: nodeunit.Test): void {

//     const broker = new MockBroker();
//     const task = null;
//     const payload = { success: true };
//     const callback = function () { };

//     test.throws(() => {
//       const context = new ExecutionContext(broker, task, payload, callback);
//     });

//     test.done();
//   },
//   "Throws when passed a null payload": function (test: nodeunit.Test): void {

//     const broker = new MockBroker();
//     const task = new MockHandler();
//     const payload = null;
//     const callback = function () { };

//     test.throws(() => {
//       const context = new ExecutionContext(broker, task, payload, callback);
//     });

//     test.done();
//   },
//   "Throws when passed a undefined payload": function (test: nodeunit.Test): void {

//     const broker = new MockBroker();
//     const task = new MockHandler();
//     const payload = undefined;
//     const callback = function () { };

//     test.throws(() => {
//       const context = new ExecutionContext(broker, task, payload, callback);
//     });

//     test.done();
//   },
//   "Throws when passed a null callback": function (test: nodeunit.Test): void {

//     const broker = new MockBroker();
//     const task = new MockHandler();
//     const payload = { success: true };
//     const callback = null;

//     test.throws(() => {
//       const context = new ExecutionContext(broker, task, payload, callback);
//     });

//     test.done();
//   },
//   "Throws when passed a undefined callback": function (test: nodeunit.Test): void {

//     const broker = new MockBroker();
//     const task = new MockHandler();
//     const payload = { success: true };
//     const callback = undefined;

//     test.throws(() => {
//       const context = new ExecutionContext(broker, task, payload, callback);
//     });

//     test.done();
//   }
// }

// const executeGroup: nodeunit.ITestGroup = {
//   "Can execute a function in the correct context": function (test: nodeunit.Test): void {

//     const broker = new MockBroker();
//     const task = new MockHandler();
//     const expected = { success: true };
//     const callback = function () { };

//     const context = new ExecutionContext(broker, task, expected, callback);
//     context.execute(payload => {

//       test.equal(payload, expected, "no payload");
//       test.done();

//       return Q.resolve(payload);
//     });

//   },
//   "Execute gracefully handles an exception raised during validation": function (test: nodeunit.Test): void {

//     const broker = new MockBroker();
//     const task = new MockHandler();
//     const expected = { success: true };
//     const error = new Error("VALIDATE");

//     const callback = function (err, data) {
//       test.equal(err.message, "the parameter \"item\" is not a populated string");
//       test.done();
//     };

//     const context = new ExecutionContext(broker, task, expected, callback);

//     gently.expect(broker, "broadcast", (eventName, message) => {
//       test.equal(eventName, task.failure, "wrong event raised");
//       return Q.resolve("finished");
//     });

//     context.check("item").is.a.string();

//     context.execute(payload => {
//       return null;
//     });

//     broker.processMessage("hi there", { item: "a" }, (err, data) => {
//     });

//   },
//   "Execute throws when passed null instead of a function": function (test: nodeunit.Test): void {

//     const broker = new MockBroker();
//     const task = new MockHandler();
//     const expected = { success: true };

//     const callback = function (err, data) {

//     };

//     const context = new ExecutionContext(broker, task, expected, callback);


//     test.throws(() => {
//       context.execute(null);
//     });

//     test.done();

//   }
// }

// exports.constructor = constructorGroup;
// exports.execute = executeGroup;
