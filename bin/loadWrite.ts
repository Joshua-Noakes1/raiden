import clc from "cli-color";
import { writeFileSync, readFileSync, existsSync } from "fs";

export function writeJSON(filename: string, data:any, supress?: boolean) {
  try {
    writeFileSync(filename, JSON.stringify(data, null, 4));
    if (!supress) console.log(clc.green("[Success]"), `Saved JSON ("${filename}")`);
  } catch (error) {
    if (!supress) console.log(clc.red("[Error]"), `Failed to save JSON ("${filename}")`,error);
    return;
  }
}

export function loadJSON(filename: string, supress?: boolean) {
  if (existsSync(filename)) {
    try {
      const json = JSON.parse(readFileSync(filename, "utf8").toString());
      if (!supress) console.log(clc.green("[Success]"), `Loaded JSON ("${filename}")`);
      return json;
    } catch (error) {
      if (!supress) console.log(clc.red("[Error]"), `Failed to load JSON ("${filename}")`, error);
      return {
        error: true,
      };
    }
  } else {
    if (!supress) console.log(clc.red("[Error]"), `Failed to load JSON ("${filename}")`);
    return {
      error: true,
    };
  }
}
