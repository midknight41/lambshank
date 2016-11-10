
export default function createContextCallback(context): (err: Error, data: any) => void {

  return function (err: Error, data: any) {

    if (err) return context.fail(err);

    return context.succeed(data);

  };

}
