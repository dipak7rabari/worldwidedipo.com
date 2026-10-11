import { bindings, defineConfig, defineWorker } from "cf/config";

export default defineConfig({
  worker: defineWorker({
    name: "worldwide-dipo",
    entrypoint: "vinext/server/fetch-handler",
    compatibilityDate: "2026-10-03",
    compatibilityFlags: ["nodejs_compat", "nodejs_compat_populate_process_env"],
    assets: { notFoundHandling: "none" },
    env: {
      ASSETS: bindings.assets(),
      VINEXT_KV_CACHE: bindings.kv({ id: "bea741d49ec544bea5c0a26d73aee8e7" }),

    },
  }),
});
