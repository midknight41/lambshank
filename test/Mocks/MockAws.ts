export class S3 {
  public putObject = stub();
  public getObject = stub();
}

export class Lambda {

  public addPermission = stub();
  public createAlias = stub();
  public createEventSourceMapping = stub();
  public createFunction = stub();
  public deleteAlias = stub();
  public deleteEventSourceMapping = stub();
  public deleteFunction = stub();
  public getAlias = stub();
  public getEventSourceMapping = stub();
  public getFunction = stub();
  public getFunctionConfiguration = stub();
  public getPolicy = stub();
  public invoke = stub();
  public listAliases = stub();
  public listEventSourceMappings = stub();
  public listFunctions = stub();
  public listVersionsByFunction = stub();
  public publishVersion = stub();
  public removePermission = stub();
  public updateAlias = stub();
  public updateEventSourceMapping = stub();
  public updateFunctionCode = stub();
  public updateFunctionConfiguration = stub();


  public endpoint = null;

  constructor() {
    return;
  }

}

function stub() {
  return function () { return; };
}

export class SNS {
  public createTopic = stub();
  public deleteTopic = stub();
  public publish = stub();
  public endpoint = null;

  constructor() {
    return;
  }
}
