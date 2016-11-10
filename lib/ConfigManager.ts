import * as nconf from "nconf";
import { IAppConfig } from "./Interfaces";
import { thrower } from "check-verify";

let config: IAppConfig;

export default function getConfig(filename: string): IAppConfig {

  // TODO: Add is.a.file() to check-verify
  thrower({ filename })
    .check("filename").is.a.string();

  if (config === null) {

    nconf.file(filename);

    config = {
      aws: nconf.get("aws"),
      sns: nconf.get("sns")
    };

  }

  return config;
}
