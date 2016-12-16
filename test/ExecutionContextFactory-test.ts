// Testing Framework
import * as Code from "code";
import * as Lab from "lab";
import * as sinon from "sinon";
import * as Q from "q";
import getHelper from "lab-testing";

import ErrorRegistry from "../lib/ErrorRegistry";
import ExecutionContextFactory from "../lib/ExecutionContextFactory";
import ExecutionContext from "../lib/ExecutionContext";
import Broker from "./Mocks/Broker";
import MockLogger from "./Mocks/Logging";

const lab = exports.lab = Lab.script();
const expect = Code.expect;
const testing = getHelper(lab);

const method = testing.createExperiment("Lambshank", "ExecutionContextFactory");

method("The constructor()", () => {

  const { broker } = buildDependencies();

  testing.standardContructorTest(ExecutionContextFactory, ["broker"], broker);

});

method("The create() method", () => {

  const { broker, factory } = buildDependencies();

  testing.throws.methodParameterTest(factory, factory.create, ["handler", "payload", "callback"], {}, {}, function () { return; });

});

method("The create() method", () => {

  lab.test("creates an execution context when called correctly", done => {
    const { broker, factory } = buildDependencies();

    const handler = {
      name: "name",
      success: "success",
      failure: "failure",
      handler: function (context) {
        return;
      }
    };
    const payload = {
      test: true
    };

    const callback = function (err, data) {
      return;
    };

    const context = factory.create(handler, payload, callback);

    expect(context).an.instanceOf(ExecutionContext);

    return done();

  });
});

function buildDependencies() {

  const broker = new Broker();
  const factory = new ExecutionContextFactory(broker);

  return { broker, factory };
}
