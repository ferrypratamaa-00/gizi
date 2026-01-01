import postgres = require("postgres");
import { appEnv } from "../core/env";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema/index";

const client = postgres(appEnv.DATABASE_URL, {
    max: 10,
});

export const db = drizzle(client, { schema });
