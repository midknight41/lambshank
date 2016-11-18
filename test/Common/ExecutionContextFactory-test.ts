// import * as nodeunit from "nodeunit";
// import * as Q from "q";

// import MockLogger from "../../Mocks/Logging";
// import MockBroker from "../../Mocks/Broker";
// import MockHandler from "../../Mocks/MockHandler";
// import ExpectationLog from "../../Mocks/MockExpectationLog";
// import ContextValidator from "../../Mocks/MockContextValidator";

// import {IBroker, IContext, IHandler} from "../../../Core/Interfaces";
// import ExecutionContextFactory from "../../../Core/ExecutionContextFactory";

// const Gently = require("gently");
// const gently = new Gently();

// const constructorGroup: nodeunit.ITestGroup = {
//   "Builds a context correctly when passed valid params": function (test: nodeunit.Test): void {

//     const broker = new MockBroker();

//     test.doesNotThrow(() => {
//       const factory = new ExecutionContextFactory(broker);
//     });

//     test.done();
//   },
//   "Throws when passed a null broker": function (test: nodeunit.Test): void {

//     const broker = null;

//     test.throws(() => {
//       const factory = new ExecutionContextFactory(broker);
//     });

//     test.done();

//   },
//   "Throws when passed a undefined broker": function (test: nodeunit.Test): void {

//     const broker = undefined;

//     test.throws(() => {
//       const factory = new ExecutionContextFactory(broker);
//     });

//     test.done();

//   }
// }

// const createGroup: nodeunit.ITestGroup = {
//   "Returns a context object if called properly": function (test: nodeunit.Test): void {

//     const broker = new MockBroker();
//     const task = new MockHandler();
//     const expected = { success: true };
//     const callback = function () { };

//     const factory = new ExecutionContextFactory(broker);
//     const context = factory.create(task, expected, callback);

//     test.notEqual(context, null);

//     test.done();

//   },
//   "Throws if passed a bad task": function (test: nodeunit.Test): void {

//     const broker = new MockBroker();
//     const task = null;
//     const expected = { success: true };
//     const callback = function () { };

//     const factory = new ExecutionContextFactory(broker);

//     test.throws(() => {
//       const context = factory.create(task, expected, callback);
//     });

//     test.done();
//   },
//   "Throws if passed a bad payload": function (test: nodeunit.Test): void {

//     const broker = new MockBroker();
//     const task = new MockHandler();;
//     const expected = null;
//     const callback = function () { };

//     const factory = new ExecutionContextFactory(broker);

//     test.throws(() => {
//       const context = factory.create(task, expected, callback);
//     });

//     test.done();
//   },
//   "Throws if passed a bad callback": function (test: nodeunit.Test): void {

//     const broker = new MockBroker();
//     const task = new MockHandler();
//     const expected = { success: true };
//     const callback = null;

//     const factory = new ExecutionContextFactory(broker);

//     test.throws(() => {
//       const context = factory.create(task, expected, callback);
//     });

//     test.done();
//   }
// }

// exports.constructor = constructorGroup;
// exports.create = createGroup;
