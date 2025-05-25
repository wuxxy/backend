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
  app.post("/", async (req, res) => {
    try {
      const additions = req.body as Record<string, any>;
      extend_json_file(REQUESTS_FILE, additions);
      return res.status(201).send({ message: "Created", added: additions });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ error: "Failed to extend JSON" });
    }
  });

  // READ (GET): Return full content
  app.get("/", async (req, res) => {
    try {
      const data = read_json_file(REQUESTS_FILE);
      return res.send(data);
    } catch (err) {
      console.error(err);
      return res.status(500).send({ error: "Failed to read JSON" });
    }
  });

  // UPDATE (PATCH): Only updates existing keys
  app.patch("/", async (req, res) => {
    try {
      const updates = req.body as Record<string, any>;
      updateJsonFile(REQUESTS_FILE, updates);
      return res.send({ message: "Updated", updated: updates });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ error: "Failed to update JSON" });
    }
  });

  // DELETE (DELETE): Remove keys entirely
  app.delete("/", async (req, res) => {
    try {
      const body = req.body as { keys: string[] };
      const current = read_json_file(REQUESTS_FILE);

      for (const key of body.keys) {
        delete current[key];
      }

      const { writeFileSync } = await import("fs");
      writeFileSync(REQUESTS_FILE, JSON.stringify(current, null, 2), "utf-8");

      return res.send({ message: "Deleted", removed: body.keys });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ error: "Failed to delete keys" });
    }
  });

  // =========================================================
  // Bodies
  // =========================================================
  app.post("/bodies", async (req, res) => {
    try {
      const body = req.body as Record<string, any>;

      if (!isValidBodyFormat(body)) {
        return res.status(400).send({ error: "Invalid body format" });
      }

      extend_json_file(BODIES_FILE, { [body.name]: body.structure });
      return res.status(201).send({ message: "Created", name: body.name });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .send({ error: "Failed to create body definition" });
    }
  });

  // READ (GET)
  app.get("/bodies", async (req, res) => {
    try {
      const data = read_json_file(BODIES_FILE);
      return res.send(data);
    } catch (err) {
      console.error(err);
      return res.status(500).send({ error: "Failed to read bodies" });
    }
  });

  // UPDATE (PATCH): only update existing keys
  app.patch("/bodies", async (req, res) => {
    try {
      const body = req.body as Record<string, any>;

      if (!isValidBodyFormat(body)) {
        return res.status(400).send({ error: "Invalid body format" });
      }

      updateJsonFile(BODIES_FILE, { [body.name]: body.structure });
      return res.send({ message: "Updated", name: body.name });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .send({ error: "Failed to update body definition" });
    }
  });

  // DELETE (DELETE)
  app.delete("/bodies", async (req, res) => {
    try {
      const body = req.body as { keys: string[] };
      const current = read_json_file(BODIES_FILE);

      for (const key of body.keys) {
        delete current[key];
      }

      const fs = await import("fs");
      fs.writeFileSync(BODIES_FILE, JSON.stringify(current, null, 2), "utf-8");

      return res.send({ message: "Deleted", removed: body.keys });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ error: "Failed to delete bodies" });
    }
  });
}
