import { ffmpeg } from "@trigger.dev/build/extensions/core";
import { prismaExtension } from "@trigger.dev/build/extensions/prisma";
import { pythonExtension } from "@trigger.dev/python/extension";
import { defineConfig, timeout } from "@trigger.dev/sdk";

export default defineConfig({
  project: "proj_mmxvrhsxnwvfxhqwauzp",
  // ee/**/lib/trigger (AI doc Q&A, dataroom freeze, conversations, billing
  // cancellation) is out of scope for this deployment and some of those
  // tasks hard-crash at import without paid-feature credentials we don't
  // configure (OpenAI, etc). lib/trigger/pdf-to-image-route.ts, the task
  // that makes uploaded documents viewable, lives outside ee/ and is
  // unaffected by dropping it.
  dirs: ["./lib/trigger"],
  maxDuration: timeout.None, // no max duration
  retries: {
    enabledInDev: false,
    default: {
      maxAttempts: 3,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10000,
      factor: 2,
      randomize: true,
    },
  },
  build: {
    external: ["mupdf"],
    extensions: [
      prismaExtension({
        mode: "legacy",
        schema: "prisma/schema/schema.prisma",
      }),
      ffmpeg(),
      pythonExtension({
        scripts: ["./**/*.py"],
      }),
    ],
  },
});
