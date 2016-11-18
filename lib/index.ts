import getConfig from "./ConfigManager";
import { CoreFramework } from "./CoreFramework";
import { thrower } from "check-verify";

export function getCoreComponents(fileName: string) {

  thrower({ fileName })
    .check("fileName").is.a.string();

  const config = getConfig(fileName);

  return new CoreFramework(config);

}
