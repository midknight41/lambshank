import getConfig from "./ConfigManager";
import { CoreFramework } from "./CoreFramework";
import { thrower } from "check-verify";
let singleton = null;

export function getCoreComponents(configFile: string): CoreFramework {

  if (singleton) return singleton;

  thrower({ configFile })
    .check("configFile").is.a.string();

  const config = getConfig(configFile);

  singleton = new CoreFramework(config);
  return singleton;

}
