import fs from "fs";
import path from "path";

function readOrInitJson(filePath: string): Record<string, any> {
  const content = fs.readFileSync(filePath, "utf-8").trim();
  if (content === "") return {};
  try {
    return JSON.parse(content);
  } catch (err) {
    console.error(`❌ Failed to parse JSON at ${filePath}`);
    throw new Error(`Invalid JSON in file: ${filePath}`);
  }
}

export function updateJsonFile(filePath: string, updates: Record<string, any>) {
  const absolutePath = path.resolve(filePath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`File does not exist: ${absolutePath}`);
  }

  const data = readOrInitJson(absolutePath);

  for (const key in updates) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      data[key] = updates[key];
    } else {
      console.warn(`Skipping key: ${key} (not found in original file)`);
    }
  }

  fs.writeFileSync(absolutePath, JSON.stringify(data, null, 2), "utf-8");
  console.log(`✅ Updated ${absolutePath}`);
}

export function read_json_file(filePath: fs.PathOrFileDescriptor) {
  return readOrInitJson(filePath.toString());
}

export function extend_json_file(
  filePath: string,
  additions: Record<string, any>
) {
  const absolutePath = path.resolve(filePath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`File does not exist: ${absolutePath}`);
  }

  const data = readOrInitJson(absolutePath);
  let modified = false;

  for (const key in additions) {
    if (!Object.prototype.hasOwnProperty.call(data, key)) {
      data[key] = additions[key];
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(absolutePath, JSON.stringify(data, null, 2), "utf-8");
    console.log(`✅ Extended ${absolutePath}`);
  } else {
    console.log(
      `⚠️  No changes made to ${absolutePath} (all keys already exist)`
    );
  }
}
