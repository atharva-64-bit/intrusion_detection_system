const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("shieldEye", {
  onPacket: (callback) => {
    ipcRenderer.on("live-packet", (_event, data) => {
      callback(data);
    });
  },
});

