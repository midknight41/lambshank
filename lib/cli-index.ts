/* tslint:disable:no-console */
import * as commander from "commander";
import * as fs from "fs";
import { thrower } from "check-verify";

const app: any = commander;
app
  .version("1.0.0")
  .option("-s, --service [name]", "The service you want to deploy")
  .option("-t, --task [name]", "A specific task you want to deploy")
  .option("-c, --config [filename]", "optional config file. defaults to './config.js'")
  .option("-r, --registry [filename]", "optional registry file. defaults to './Registries/Registry.js'")
  .parse(process.argv);

let registryFile: string = "./Registries/Registry.js";

if (app.registry) {
  registryFile = app.registry;
}

/* tslint:disable:no-require-imports */
const Registry = require(registryFile);
/* tslint:enable:no-require-imports */

processArguments(app);

function processArguments(app) {

  const service = getService(app.service);

  if (app.task) {

    console.log(`creating task "${app.task}"`);

    return createTaskFile(service.tasks[app.task], service);

  }

  console.log("creating all tasks...");

  for (const task of Object.keys(service.tasks)) {

    createTaskFile(service.tasks[task], service);

  }

}

function createTaskFile(task, service) {

  /*

  The body looks something like this...

  "use strict";
  var deps = require("./Services/Radar/deps");
  var lambshank = require("lambshank");
  var eventName = "Task-Radar-Get";
  var filename = "./config.json";
  var core = lambshank.getCoreComponents(filename);
  deps.init(filename);
  var bridge = core.createBridge(eventName);
  exports.handler = bridge.handler.bind(bridge);
  exports.event = eventName;

  */

  const output =
    `"use strict";\n` +
    `var deps = require("${service.dependencies}");\n` +
    `var lambshank = require("lambshank");\n` +
    `var eventName = "${task}";\n` +
    `var filename = "./config.json";\n` +
    `var core = lambshank.getCoreComponents(filename);\n` +
    `deps.init(filename);\n` +
    `var bridge = core.createBridge(eventName);\n` +
    `exports.handler = bridge.handler.bind(bridge);\n` +
    `exports.event = eventName;\n`;

  const lambdaName = `${task}`;
  const fileName = `./__${task}.js`;

  fs.writeFileSync(fileName, output);

  console.log(`[CREATED] ${lambdaName} handler as ${fileName}`);

}

export interface IService {
  name: string;
  dependencies: string;
  tasks: any;
}

/*
function getRegistry(fileName: string) {

  thrower({ fileName })
    .check("fileName").is.a.string();

  const configText = fs.readFileSync(fileName, "UTF-8");

  return JSON.parse(configText);

}
*/

function getService(name: string): IService {

  const registryEntry = Registry[name];

  if (!registryEntry) throw new Error(`Service '${name}' not found`);

  return ({
    name: name,
    dependencies: `./Services/${name}/deps`,
    tasks: registryEntry.Tasks
  });

}
