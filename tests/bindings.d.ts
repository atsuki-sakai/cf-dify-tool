import type { D1Migration } from "cloudflare:test";
import type { Env as AppEnv } from "../worker-configuration";

export type Env = AppEnv & {
  MIGRATIONS: D1Migration[];
  APIKEY: string;
  ENDPOINT_URL: string;
};

declare module "cloudflare:test" {
  interface ProvidedEnv extends Env {}
}
