// ml/mlBridge.js
import { spawn } from "child_process";
import path from "path";

let pyProcess = null;

/**
 * Start Python inference process (singleton)
 */
function startPython() {
  if (pyProcess) return;

  const scriptPath = path.join(process.cwd(), "ml", "inference.py");

  pyProcess = spawn("python", [scriptPath]);

  pyProcess.stderr.on("data", (data) => {
    console.error("ML stderr:", data.toString());
  });

  pyProcess.on("close", () => {
    pyProcess = null;
    console.warn("ML process exited");
  });
}

/**
 * Send features → Python → get label
 */
export function mlPredict(features) {
  startPython();

  return new Promise((resolve, reject) => {
    try {
      pyProcess.stdin.write(JSON.stringify(features) + "\n");

      const onData = (data) => {
        const label = data.toString().trim();
        pyProcess.stdout.off("data", onData);
        resolve(label);
      };

      pyProcess.stdout.on("data", onData);
    } catch (err) {
      reject(err);
    }
  });
}
