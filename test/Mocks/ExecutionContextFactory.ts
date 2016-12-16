import {IBroker, IHandler, IContext} from "../../lib/Interfaces";

export default class MockExecutionContextFactory {

  public create<Request, Response>(taskHandler: IHandler<Request, Response>, msg: any, callback: (err, data) => void): IContext<Request, Response> {
    return null;
  }
}
