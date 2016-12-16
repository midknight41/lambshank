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

const lab = exports.lab = Lab.script();
const expect = Code.expect;
const testing = getHelper(lab);

const method = testing.createExperiment("Lambshank", "ExecutionContext");

method("The constructor()", () => {

  const { broker } = buildDependencies();

  testing.standardContructorTest(ExecutionContext, ["broker", "handler", "payload", "callback"], new Broker(), {}, {}, function () { return; });

});

method("The create() method", () => {

  const { broker } = buildDependencies();


});

function buildDependencies() {

  const broker = new Broker();

  return { broker };
}
