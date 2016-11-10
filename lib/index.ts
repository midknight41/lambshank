import getConfig from "./ConfigManager";
import { CoreFramework } from "./CoreFramework";

export function getCoreComponents(configFilename: string) {

  const config = getConfig(configFilename);
  return new CoreFramework(config);

}
