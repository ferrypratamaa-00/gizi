import postgres = require("postgres");
import { appEnv } from "../core/env";
import { drizzle } from "drizzle-orm/singlestore/driver";
import * as schema from "./schema";

const client = postgres(appEnv.DATABASE_URL, {
    max: 10,
});

export const db = drizzle(client, { schema });
