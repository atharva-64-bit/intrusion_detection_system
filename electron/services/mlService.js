import { spawn } from "child_process";

export function runML(features) {
  return new Promise((resolve, reject) => {
    const py = spawn("python", ["ml/inference.py"]);

    py.stdin.write(JSON.stringify(features) + "\n");

    py.stdout.on("data", (data) => {
      resolve(data.toString().trim());
    });

    py.stderr.on("data", (err) => {
      console.error(err.toString());
      reject(err);
    });
  });
}