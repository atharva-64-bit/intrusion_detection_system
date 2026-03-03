import { createContext, useContext, useEffect, useRef, useState } from "react";

const LivePacketContext = createContext(null);

export function LivePacketProvider({ children }) {
  const [packets, setPackets] = useState([]);
  const packetsPerSecRef = useRef(0);
  const [packetsPerSec, setPacketsPerSec] = useState(0);

  useEffect(() => {
    if (!window.shieldEye) return;

    // ✅ SINGLE global IPC listener
    window.shieldEye.onPacket((packet) => {
      packetsPerSecRef.current++;

      setPackets((prev) => {
        const updated = [
          ...prev,
          {
            time: packet.time,
            src: packet.src,
            dest: packet.dest,
            proto: packet.proto,
            port: packet.port,  
            size: packet.size,
            threat: "Normal", // later replaced by ML
          },
        ];

        return updated.slice(-300); // prevent UI overload
      });
    });

    // ✅ packets/sec ticker (used by Dashboard chart)
    const interval = setInterval(() => {
      setPacketsPerSec(packetsPerSecRef.current);
      packetsPerSecRef.current = 0;
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <LivePacketContext.Provider value={{ packets, packetsPerSec }}>
      {children}
    </LivePacketContext.Provider>
  );
}

export function useLivePackets() {
  return useContext(LivePacketContext);
}
