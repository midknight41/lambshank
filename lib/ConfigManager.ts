import * as nconf from "nconf";
import { IAppConfig } from "./Interfaces";
import { thrower } from "check-verify";
import * as fs from "fs";

let config: IAppConfig = null;

export default function getConfig(filename: string): IAppConfig {

  // TODO: Add is.a.file() to check-verify
  thrower({ filename })
    .check("filename").is.a.string();

  const file = fs.readFileSync(filename);

  if (config === null) {

    const provider = nconf.file({ file: filename });

    config = {
      aws: nconf.get("aws"),
      sns: nconf.get("sns")
    };

  }

  return config;
}
