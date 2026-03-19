import { createPluginRuntimeStore } from "openclaw/plugin-sdk/compat";
import type { PluginRuntime } from "openclaw/plugin-sdk/matrix";

const {
  setRuntime: setMatrixRuntime,
  clearRuntime: clearMatrixRuntime,
  tryGetRuntime: tryGetMatrixRuntime,
  getRuntime: getMatrixRuntime,
} = createPluginRuntimeStore<PluginRuntime>("Matrix runtime not initialized");
export { clearMatrixRuntime, getMatrixRuntime, setMatrixRuntime, tryGetMatrixRuntime };
