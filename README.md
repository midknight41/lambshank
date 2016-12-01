# lambshank

[![Build Status](https://travis-ci.org/midknight41/lambshank.svg?branch=master)](https://travis-ci.org/midknight41/lambshank) [![Coverage Status](https://coveralls.io/repos/github/midknight41/lambshank/badge.svg?branch=master)](https://coveralls.io/github/midknight41/lambshank?branch=master)
[![Deps](https://david-dm.org/midknight41/lambshank.svg)](https://david-dm.org/midknight41/lambshank#info=dependencies) [![devDependency Status](https://david-dm.org/midknight41/lambshank/dev-status.svg)](https://david-dm.org/midknight41/lambshank#info=devDependencies)

[![NPM](https://nodei.co/npm/lambshank.png?downloads=true)](https://www.npmjs.com/package/lambshank/)

Extremely experimental and not proven to work yet. :)

### Register Dependencies
```js

export function init(core) {

  const { build } = core.createComponentBuilder("Radar");

  // Build the service and its dependencies
  const repo = build(Repository, new AWS.DynamoDB.DocumentClient());
  const service = build(Service, repo);

  // Build and Register handlers and listen for events
  // the build() function injects the logging utility into the handler

  core.registerHandlers([
    build(AddHandler, service),
    build(GetHandler, service),
    build(DeleteHandler, service),
    build(ListHandler, service),
    build(UpdateHandler, service)
  ]);

}
```

### Generated handler bootstrap
```js

const filename = "./config.json";

lambshank.configure(filename);
const core = lambshank.getCoreComponents();

deps.init(core);

const bridge = core.createBridge(taskName);

exports.handler = bridge.handler.bind(bridge);
exports.event = taskName;

```