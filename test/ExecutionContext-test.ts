// Testing Framework
import * as Code from "code";
import * as Lab from "lab";
import * as sinon from "sinon";
import * as Q from "q";
import getHelper from "lab-testing";

import ErrorRegistry from "../lib/ErrorRegistry";
import ExecutionContext from "../lib/ExecutionContext";
import Broker from "./Mocks/Broker";
import MockLogger from "./Mocks/Logging";
import MockHandler from "./Mocks/Handler";

const lab = exports.lab = Lab.script();
const expect = Code.expect;
const testing = getHelper(lab);

const method = testing.createExperiment("Lambshank", "ExecutionContext");

method("The constructor()", () => {

  const { broker } = buildDependencies();

  testing.standardContructorTest(ExecutionContext, ["broker", "handler", "payload", "callback"], new Broker(), {}, {}, function () { return; });

});

method("The check() method", () => {

  const { broker, context } = buildDependencies();

  testing.throws.methodParameterTest(context, context.check, ["field"], "fieldName");

});

method("The execute() method", () => {

  const { broker, context } = buildDependencies();

  testing.throws.methodParameterTest(context, context.execute, ["payload"], function (payload) { return; });

});

/*

method("The fail() method", () => {

  const { broker, context } = buildDependencies();

  testing.throws.methodParameterTest(context, context.fail, ["error", "message"], new Error("ERROR"), { success: false });

});

method("The finish() method", () => {

  const { broker, context } = buildDependencies();

  testing.throws.methodParameterTest(context, context.finish, ["message"], { success: true });

});

*/

function buildDependencies() {

  const broker = new Broker();
  const callback = function (err, data) {
    return;
  };
  const payload = { test: true };
  const taskHandler = new MockHandler();

  const context = new ExecutionContext(broker, taskHandler, payload, callback);

  return { broker, callback, context, payload, taskHandler };
}
