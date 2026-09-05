const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("shieldEye", {
  onPacket: (callback) => {
    ipcRenderer.on("live-packet", (_event, data) => {
      callback(data);
    });
  },
});

contextBridge.exposeInMainWorld("mlAPI", {
  predict: (features) => ipcRenderer.invoke("ml-predict", features),
});

contextBridge.exposeInMainWorld("snifferAPI", {
  start: () => ipcRenderer.invoke("sniffer:start"),
  stop: () => ipcRenderer.invoke("sniffer:stop"),
});
