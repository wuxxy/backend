import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { extend_json_file, read_json_file, updateJsonFile } from "../utils/file_manager.js";
import path from "path";
const REQUESTS_FILE = path.resolve("./modifiable/requests.json");
const BODIES_FILE = path.resolve("./modifiable/bodies.json");

const allowedTypes = ["string", "number", "json", "boolean"];

function isValidBodyFormat(obj: any): boolean {
  return (
    typeof obj === "object" &&
    typeof obj.name === "string" &&
    Array.isArray(obj.structure) &&
    obj.structure.every(
      (field: { key: any; type: string; }) =>
        typeof field.key === "string" && allowedTypes.includes(field.type)
    )
  );
}

export default async function registerRequestRoutes(app: FastifyInstance) {
  // CREATE (POST): Add new keys if they don't already exist
}
