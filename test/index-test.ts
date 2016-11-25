// Testing Framework
import * as Code from "code";
import * as Lab from "lab";
import getHelper from "lab-testing";

import * as lambshank from "../lib/index";

const lab = exports.lab = Lab.script();
const { expect, fail } = Code;
const helper = getHelper(lab);

const method = helper.createExperiment("Lambshank", "External");
const fileName = "./test/data/config.json";

method("getCoreComponents", () => {

  lab.test("returns the core framework when passed a correct FQ filename", done => {

    const core = lambshank.getCoreComponents(fileName);

    expect(core).to.be.an.object();
    return done();

  });

  helper.functionParameterTest(lambshank.getCoreComponents, ["configFile"], fileName);

/*

  lab.test("throws when provided a null filename", done => {

    try {
      const core = lambshank.getCoreComponents(null);
      Code.fail("no error");

    } catch (error) {
      expect(error).to.be.an.error();
    }

    return done();

  });

  lab.test("throws when provided an undefined filename", done => {

    try {
      const core = lambshank.getCoreComponents(undefined);
      Code.fail("no error");

    } catch (error) {
      expect(error).to.be.an.error();
    }

    return done();


  });

*/

  lab.test("throws when provided a well-formed JSON document which doesn't have a topicRoot", done => {

    try {
      const core = lambshank.getCoreComponents("./data/badconfig.json");
      Code.fail("no error");

    } catch (error) {
      expect(error).to.be.an.error();
    }
    return done();

  });

});
