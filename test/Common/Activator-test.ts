// import * as nodeunit from "nodeunit";
// import * as Q from "q";

// import MockLogger from "../../Mocks/Logging";
// import MockBroker from "../../Mocks/Broker";
// import MockHandler from "../../Mocks/MockHandler";
// import MockExecutionContextFactory from "../../Mocks/MockExecutionContextFactory";

// import Activator from "../../../Core/Activator";
// import {IBroker, IContext, IHandler} from "../../../Core/Interfaces";
// import ExecutionContext from "../../../Core/ExecutionContext";

// const Gently = require("gently");
// const gently = new Gently();

// const constructorGroup: nodeunit.ITestGroup = {
//   "Builds a task correct when passed valid params": function (test: nodeunit.Test): void {

//     const broker = new MockBroker();
//     const logger = new MockLogger();
//     const contextFactory: any = new MockExecutionContextFactory();

//     const activator = new Activator(broker, logger, contextFactory);
//     test.done();
//   },
//   "Throws when passed a null broker": function (test: nodeunit.Test): void {

//     const logger = new MockLogger();
//     const contextFactory: any = new MockExecutionContextFactory();

//     test.throws(() => {
//       const task = new Activator(null, logger, contextFactory);
//     });
//     test.done();

//   },
//   "Throws when passed a undefined broker": function (test: nodeunit.Test): void {

//     const logger = new MockLogger();
//     const contextFactory: any = new MockExecutionContextFactory();

//     test.throws(() => {
//       const task = new Activator(undefined, logger, contextFactory);
//     });
//     test.done();

//   }, "Throws when passed a null logger": function (test: nodeunit.Test): void {

//     const broker = new MockBroker();
//     const contextFactory: any = new MockExecutionContextFactory();

//     test.throws(() => {
//       const task = new Activator(broker, null, contextFactory);
//     });
//     test.done();

//   },
//   "Throws when passed a undefined logger": function (test: nodeunit.Test): void {

//     const broker = new MockBroker();
//     const contextFactory: any = new MockExecutionContextFactory();

//     test.throws(() => {
//       const task = new Activator(broker, undefined, contextFactory);
//     });
//     test.done();
//   }
// }

// const registerGroup: nodeunit.ITestGroup = {
//   "Correctly register a taskHandler": function (test: nodeunit.Test): void {
//     const broker = new MockBroker();
//     const logger = new MockLogger();

//     const taskHandler = new MockHandler();
//     const contextFactory: any = new MockExecutionContextFactory();

//     const activator = new Activator(broker, logger, contextFactory);

//     test.equal(broker.listeners(taskHandler.name).length, 0, "expected zero events before register");

//     activator.register(taskHandler);

//     test.equal(broker.listeners(taskHandler.name).length, 1, "event not registered");

//     test.done();
//   },
//   "Can execute the handler code": function (test: nodeunit.Test): void {
//     const broker = new MockBroker();
//     const logger = new MockLogger();

//     const taskHandler = new MockHandler();
//     const contextFactory: any = new MockExecutionContextFactory();

//     const activator = new Activator(broker, logger, contextFactory);
//     const testMsg = { success: true };


//     gently.expect(contextFactory, "create", (task, payload, callback) => {
//       return new ExecutionContext(broker, task, payload, callback);
//     });

//     gently.expect(taskHandler, "handler", context => {

//       test.notEqual(context, null, "no context returned");
//       test.equal(context.payload, testMsg, "payload is not correct");
//       return Q.resolve(context.payload);

//     });

//     activator.register(taskHandler);

//     broker.emit(taskHandler.name, testMsg, (err, data) => {
//       // This callback is not invoked by the activator so it isn't tested here
//     });

//     test.done();
//   },
//   "Throws on a null taskHandler": function (test: nodeunit.Test): void {
//     const broker = new MockBroker();
//     const logger = new MockLogger();
//     const contextFactory: any = new MockExecutionContextFactory();

//     const activator = new Activator(broker, logger, contextFactory);

//     test.throws(() => {
//       activator.register(null);
//     });

//     test.done();
//   },
//   "Throws on a null taskHandler.name": function (test: nodeunit.Test): void {
//     const broker = new MockBroker();
//     const logger = new MockLogger();
//     const contextFactory: any = new MockExecutionContextFactory();
//     const taskHandler = new MockHandler();

//     const activator = new Activator(broker, logger, contextFactory);

//     taskHandler.name = null;

//     test.throws(() => {
//       activator.register(taskHandler);
//     });

//     test.done();
//   },
//   "Throws on a null taskHandler.success": function (test: nodeunit.Test): void {
//     const broker = new MockBroker();
//     const logger = new MockLogger();
//     const contextFactory: any = new MockExecutionContextFactory();
//     const taskHandler = new MockHandler();

//     const activator = new Activator(broker, logger, contextFactory);

//     taskHandler.success = null;

//     test.throws(() => {
//       activator.register(taskHandler);
//     });

//     test.done();
//   },
//   "Throws on a null taskHandler.failure": function (test: nodeunit.Test): void {
//     const broker = new MockBroker();
//     const logger = new MockLogger();
//     const contextFactory: any = new MockExecutionContextFactory();
//     const taskHandler = new MockHandler();

//     const activator = new Activator(broker, logger, contextFactory);

//     taskHandler.failure = null;

//     test.throws(() => {
//       activator.register(taskHandler);
//     });

//     test.done();
//   }
// }

// exports.constructor = constructorGroup;
// exports.register = registerGroup;
