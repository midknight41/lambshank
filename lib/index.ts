import getConfig from "./ConfigManager";
import { CoreFramework } from "./CoreFramework";
import { thrower } from "check-verify";
export * from "./Interfaces";

let singleton = null;

export function getCoreComponents(configFile: string): CoreFramework {

  thrower({ configFile })
    .check("configFile").is.a.string();

  if (singleton) return singleton;

  const config = getConfig(configFile);

  singleton = new CoreFramework(config);
  return singleton;

}
