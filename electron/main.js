import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { startSniffer, stopSniffer } from "./services/packetSniffer.js";
import { getBestInterface } from "./services/interfaceSelector.js";
import { tsharkProcess } from "./services/packetSniffer.js";
import { runML } from "./services/mlService.js";

const iface = getBestInterface();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = !app.isPackaged;

let mainWindow; // ⭐ GLOBAL reference

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 768,
    backgroundColor: "#12181B",
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    mainWindow.loadURL("http://localhost:5173/");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}

app.whenReady().then(() => {
  createWindow();

  // ✅ Start sniffer ON by default
  startSniffer(iface);
  console.log("Packet sniffer started");

  // ✅ IPC: Start Sniffer (from button)
  ipcMain.handle("sniffer:start", () => {
    startSniffer(iface);
    return "started";
  });

  // ✅ IPC: Stop Sniffer (from button)
  ipcMain.handle("sniffer:stop", () => {
    stopSniffer();
    return "stopped";
  });

  // ✅ ML Prediction
  ipcMain.handle("ml-predict", async (_event, features) => {
    const result = await runML(features);
    return result;
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("before-quit", () => {
  if (tsharkProcess) {
    tsharkProcess.kill("SIGINT");
    console.log("🛑 tshark stopped");
  }
});

