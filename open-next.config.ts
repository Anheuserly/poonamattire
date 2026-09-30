import {
  defineCloudflareConfig,
  type OpenNextConfig,
} from "@opennextjs/cloudflare";

const baseConfig = defineCloudflareConfig();

const config: OpenNextConfig = {
  ...baseConfig,
  edgeExternals: [...(baseConfig.edgeExternals || []), "pg-cloudflare"],
  buildCommand: "next build",
};

export default config;
