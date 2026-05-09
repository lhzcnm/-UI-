import { parentPort, workerData } from "node:worker_threads"
import obfuscator from "vite-plugin-bundle-obfuscator"
import { visualizer } from 'rollup-plugin-visualizer'
import { build } from "vite"
import { fileURLToPath, URL } from 'node:url'

function resolve(path) {
  return fileURLToPath(new URL(path, import.meta.url))
}

function manualChunks(id) {
  // vue core
  if (
    id.includes("/node_modules/vue/") ||
    id.includes("/node_modules/@vue/")
  ) {
    return "vue";
  }

  // tiptap ecosystem
  if (
    id.includes("tiptap") ||
    id.includes("prosemirror") ||
    id.includes("w3c-keyname") ||
    id.includes("orderedmap") ||
    id.includes("rope-sequence")
  ) {
    return "tiptap";
  }

  // echarts ecosystem
  if (id.includes("echarts")) {
    return "echarts";
  }

  // utility libs
  if (
    id.includes("@vueuse") ||
    id.includes("@floating-ui") ||
    id.includes("@iconify/vue") ||
    id.includes("vue-sonner") ||
    id.includes("axios") ||
    id.includes("dayjs") ||
    id.includes("ohash") ||
    id.includes("klona")
  ) {
    return "vendor-utils";
  }

  // app modules
  if (id.includes("modules/other")) return "other";
  if (id.includes("modules/desktop")) return "desktop";
  if (id.includes("modules/mobile")) return "mobile";
  if (id.includes("modules/auth")) return "auth";

  // fallback
  if (id.includes("node_modules")) {
    return "vendor";
  }
}

async function startBuild() {
  const { item } = workerData;
  const plugins = [
    // visualizer({ filename: `./dist/${item.mode}/stats.html` })
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
      resolve: {
        alias: {
          '@logo': resolve(`../src/components/logos/${item.mode}.vue`)
        }
      },
      plugins,
      envDir: "./config",
      // cacheDir: `node_modules/.vite_${item.mode}`,
      cacheDir: `node_modules/.vite_${item.mode}`,
      mode: item.mode,
      build: {
        outDir: `./dist/${item.mode}`,
        emptyOutDir: true,
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
            // dir: `./dist/${item.mode}`,
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
