// Testing Framework
import * as Code from "code";
import * as Lab from "lab";
import getHelper from "lab-testing";

import * as lambshank from "../lib/index";

const lab = exports.lab = Lab.script();
const expect = Code.expect;
const helper = getHelper(lab);

const method = helper.createExperiment("Lambshank", "CoreFramework");

method("some function", () => {

  lab.test("Test one", done => {

    return done();

  });
});
