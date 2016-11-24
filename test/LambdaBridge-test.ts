// Testing Framework
import * as Code from "code";
import * as Lab from "lab";
import * as sinon from "sinon";

import getHelper from "lab-testing";

import { LambdaBridge } from "../lib/LambdaBridge";

import Broker from "./Mocks/Broker";
import LambdaContext from "./Mocks/LambdaContext";

const lab = exports.lab = Lab.script();
const { expect, fail } = Code;
const helper = getHelper(lab);

const method = helper.createExperiment("Lambshank", "LambdaBridge");
const fileName = "./test/data/config.json";

method("The constructor", () => {
  helper.standardContructorTest(LambdaBridge, ["eventName", "broker"], "event1", new Broker());
});

method("The handler() method", () => {

    const payload = {
      data: "hi"
    };
  let broker = new Broker();
  let bridge = new LambdaBridge("event1", broker);

  helper.methodParameterTest(bridge, bridge.handler, ["eventPayload", "context"], payload, new LambdaContext());

});

method("The handler() method", () => {

  lab.test("correctly routes a message to the broker", done => {

    const payload = {
      data: "hi"
    };

    let broker = new Broker();
    let bridge = new LambdaBridge("event1", broker);

    const context = new LambdaContext();

    const spy = sinon.spy(broker, "processMessage");

    bridge.handler(payload, context);

    expect(spy.calledOnce).to.be.true();
    expect(spy.getCall(0).args[0]).to.equal("event1");
    expect(spy.getCall(0).args[1]).to.equal(payload);
    expect(spy.getCall(0).args[2]).to.be.a.function();

    return done();
  });

});
