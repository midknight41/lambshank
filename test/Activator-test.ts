// Testing Framework
import * as Code from "code";
import * as Lab from "lab";
import * as sinon from "sinon";
import * as Q from "q";
import getHelper from "lab-testing";

import ErrorRegistry from "../lib/ErrorRegistry";
import Activator from "../lib/Activator";
import MockLogger from "./Mocks/Logging";
import ExecutionContextFactory from "./Mocks/ExecutionContextFactory";
import Broker from "./Mocks/Broker";

const lab = exports.lab = Lab.script();
const expect = Code.expect;
const testing = getHelper(lab);

const method = testing.createExperiment("Lambshank", "Activator");

method("The constructor()", () => {

  const {activator, broker, contextFactory, logger} = buildDependencies();

  testing.standardContructorTest(Activator, ["broker", "logger", "contextFactory"], broker, logger, contextFactory);

});

method("The register() method", () => {
  const activator = buildDependencies().activator;
  const taskHandler = {
    name: "name",
    failure: "failure",
    success: "success",
    handler: function () { return; }
  };
  testing.throws.methodParameterTest(activator, activator.register, ["taskHandler"], taskHandler);
});


method("The register() method", () => {

  let activator: Activator;
  let broker: Broker;
  let taskHandler;
  let on: Sinon.SinonSpy;
  let factory: ExecutionContextFactory;

  lab.beforeEach(done => {

    const deps = buildDependencies();

    activator = deps.activator;
    broker = deps.broker;
    factory = deps.contextFactory;

    on = sinon.spy(broker, "on");

    taskHandler = {
      name: "name",
      failure: "failure",
      success: "success",
      handler: function () { return; }
    };

    done();

  });

  lab.beforeEach(done => {
    on.restore();
    done();
  });

  lab.test("Can register a task correctly", done => {

    taskHandler = {
      name: "name",
      failure: "failure",
      success: "success",
      handler: function () { return; }
    };

    // registration should add one listener. Check pre-condition first
    expect(broker.listeners(taskHandler.name)).to.have.length(0);

    activator.register(taskHandler);
    expect(broker.listeners(taskHandler.name)).to.have.length(1);
    done();

  });

  lab.test("routes a message to the handler correctly", done => {

    const spy = sinon.spy(function (context) {
      expect(context.stub).to.be.true();
      createStub.restore();
      return;
    });

    taskHandler = {
      name: "name",
      failure: "failure",
      success: "success",
      handler: spy
    };

    const testMsg = { test: true };

    const createStub = sinon.stub(factory, "create", (handler, msg, callback) => {

      expect(handler).to.equal(taskHandler);
      expect(msg).to.equal(testMsg);
      expect(callback).to.be.a.function();

      return { stub: true };
    });

    activator.register(taskHandler);
    expect(broker.listeners(taskHandler.name)).to.have.length(1);

    broker.emit(taskHandler.name, testMsg, function (err, data) { return; });

    process.nextTick(() => {
      expect(spy.called).to.be.true();

      return done();

    });

  });

  lab.test("throws when task definition doesn't contain a name", done => {

    taskHandler = {
      name: "",
      failure: "failure",
      success: "success",
      handler: function () { return; }
    };

    const fnc = function () {
      activator.register(taskHandler);
    };

    expect(fnc).to.throw(Error, `the parameter "taskHandler.name" is not a populated string`);

    return done();

  });

  lab.test("throws when task definition doesn't contain a success attribute", done => {

    taskHandler = {
      name: "name",
      failure: "failure",
      success: "",
      handler: function () { return; }
    };

    const fnc = function () {
      activator.register(taskHandler);
    };

    expect(fnc).to.throw(Error, `the parameter "taskHandler.success" is not a populated string`);

    return done();

  });

  lab.test("throws when task definition doesn't contain a failure attribute", done => {

    taskHandler = {
      name: "name",
      failure: "",
      success: "success",
      handler: function () { return; }
    };

    const fnc = function () {
      activator.register(taskHandler);
    };

    expect(fnc).to.throw(Error, `the parameter "taskHandler.failure" is not a populated string`);

    return done();

  });

  lab.test("throws when task definition doesn't contain a handler function", done => {

    taskHandler = {
      name: "name",
      failure: "failure",
      success: "success",
      handler: null
    };

    const fnc = function () {
      activator.register(taskHandler);
    };

    expect(fnc).to.throw(Error, `the parameter "taskHandler.handler" is not a function`);

    return done();

  });

});

function buildDependencies() {

  const contextFactory: any = new ExecutionContextFactory();
  const broker = new Broker();
  const logger = new MockLogger();
  const activator = new Activator(broker, logger, contextFactory);

  return { activator, broker, contextFactory, logger };
}

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
