import { parentPort, workerData } from "node:worker_threads"
import obfuscator from "vite-plugin-bundle-obfuscator"
import { visualizer } from 'rollup-plugin-visualizer'
import { build } from "vite"

function manualChunks(id) {
  // console.log(id)
  if (id.includes("jsencrypt")) return "jsencrypt";
  if (
    id.includes("tiptap") ||
    id.includes("prosemirror") ||
    id.includes("w3c-keyname") ||
    id.includes("orderedmap") ||
    id.includes("rope-sequence")
  )
    return "tiptap";

  if (id.includes("echarts") || id.includes("zrender") || id.includes("tslib"))
    return "echarts";

  if (
    id.includes("@vueuse") ||
    id.includes("@floating-ui") ||
    id.includes("@iconify/vue") ||
    id.includes("tailwind") ||
    id.includes("vue-sonner") ||
    id.includes("axios") ||
    id.includes("dayjs") ||
    id.includes("ohash") ||
    id.includes("klona")
  )
    return "vendor-utils";

  if (id.includes("node_modules")) return "vendor";

  if (id.includes("modules/other")) return "other";
  if (id.includes("modules/desktop")) return "desktop";
  if (id.includes("modules/mobile")) return "mobile";
  if (id.includes("modules/auth")) return "auth";

  // console.log(`manual chunk common package: ${id}`)

  return undefined;
}

async function startBuild() {
  const { item } = workerData;
  const plugins = [
    visualizer({ filename: `./dist/${item.mode}/stats.html` })
  ];

  if (item.obfuscator) {
    plugins.push(
      obfuscator({
        log: false,
        threadPool: true,
        excludes: ["vendor", "vendor-utils", "jsencrypt", "echarts", "tiptap"],
        options: {
          controlFlowFlattening: false,
          transformObjectKeys: false,
          deadCodeInjection: false,
          stringArray: false,
        },
      }),
    );
  }

  try {
    await build({
      plugins,
      envDir: "./config",
      mode: item.mode,
      build: {
        chunkSizeWarningLimit: 1024,
    
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
          },
        },
        sourcemap: false,
        rollupOptions: {
          output: {
            dir: `./dist/${item.mode}`,
            manualChunks,
          },
          // onwarn(warning, warn) {
          //   console.log(`${warning}, line: 84`)
          //   // if (warning.code === "CIRCULAR_DEPENDENCY") {
          //   //   console.log("循环依赖:");
          //   //   console.dir(warning)
          //   // }
          //   warn(warning);
          // },
        },
      },
    });
    parentPort.postMessage({ success: true, mode: item.mode });
  } catch (error) {
    parentPort.postMessage({
      success: false,
      mode: item.mode,
      error: error.message,
    });
  }
}

startBuild();
