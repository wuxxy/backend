// update-json.ts

import fs from 'fs';
import path from 'path';

// Accept file path and update object
export function updateJsonFile(filePath: string, updates: Record<string, any>) {
  const absolutePath = path.resolve(filePath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`File does not exist: ${absolutePath}`);
  }

  // Read + parse the JSON
  const fileContent = fs.readFileSync(absolutePath, 'utf-8');
  const data = JSON.parse(fileContent);

  // Apply updates
  for (const key in updates) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      data[key] = updates[key];
    } else {
      console.warn(`Skipping key: ${key} (not found in original file)`);
    }
  }

  // Save updated file
  fs.writeFileSync(absolutePath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`✅ Updated ${absolutePath}`);
}

