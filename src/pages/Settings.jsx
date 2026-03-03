import { useState, useEffect } from "react";
import { Settings as SettingsIcon, Bell, Shield, Zap, Check } from "lucide-react";
import { authFetch } from "../utils/api";

export default function Settings() {
  const [autoStart, setAutoStart] = useState(true);
  const [realTimeMonitoring, setRealTimeMonitoring] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(false);
  const [firewallBlocking, setFirewallBlocking] = useState(true);
  const [logAnonymized, setLogAnonymized] = useState(true);
  const [modelSensitivity, setModelSensitivity] = useState("balanced");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
  authFetch("/test/secure")
    .then(res => res.json())
    .then(data => console.log("Secure test:", data));
}, []);

  const handleSave = () => {
    setSaved(true);
    // You'd typically make an API call here
    setTimeout(() => setSaved(false), 2000);
  };

  const Toggle = ({ label, checked, onChange, subtitle }) => (
    <div className="flex items-center justify-between py-4 group"> {/* Increased vertical padding */}
      <div>
        <p className="text-base text-gray-200 group-hover:text-cyan-300 transition-colors duration-200 font-semibold tracking-wide">
          {label}
        </p>
        {subtitle && (
          <p className="text-xs text-gray-500 mt-1 font-medium font-sans">
            {subtitle}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-6 rounded-full flex items-center px-1 transition-all duration-300
          ${checked ? "bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/40" : "bg-gray-700"}
          hover:scale-105`}
      >
        <div
          className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="space-y-8 text-gray-200 font-sans">
      {/* --- HEADER --- */}
      <div>
        <h1 className="text-2xl font-bold text-cyan-400 mb-1 flex items-center gap-2 tracking-wide">
          <SettingsIcon className="w-7 h-7" />
          System Settings
        </h1>
        <p className="text-m font-semibold text-gray-400">
          Configure ShieldEye behaviour, monitoring, and security preferences
        </p>
      </div>

      {/* --- SETTINGS SECTIONS GRID --- */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* General Settings */}
        <div
          className="bg-gradient-to-br from-[#12181b] to-[#0c0f13]
          p-6 rounded-xl border border-cyan-500/10 backdrop-blur-xl
          hover:border-cyan-500/30 transition-all duration-300
          hover:shadow-lg hover:shadow-cyan-500/10"
          style={{ animation: 'fadeInUp 0.5s ease-out 0.1s both' }}
        >
          <div className="flex items-center gap-2 mb-4 border-b border-gray-700/30 pb-3">
            <SettingsIcon className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-cyan-400 tracking-wide">
              General Configuration
            </h2>
          </div>
          <div className="space-y-1">
            <Toggle
              label="Start ShieldEye on system boot"
              subtitle="Launch the app automatically when system starts."
              checked={autoStart}
              onChange={setAutoStart}
            />
            <div className="border-t border-gray-700/30 my-1"></div>
            <Toggle
              label="Enable real-time monitoring by default"
              subtitle="Begin live packet analysis when the app opens."
              checked={realTimeMonitoring}
              onChange={setRealTimeMonitoring}
            />
          </div>
        </div>

        {/* Notifications & Alerts */}
        <div
          className="bg-gradient-to-br from-[#12181b] to-[#0c0f13]
          p-6 rounded-xl border border-cyan-500/10 backdrop-blur-xl
          hover:border-cyan-500/30 transition-all duration-300
          hover:shadow-lg hover:shadow-cyan-500/10"
          style={{ animation: 'fadeInUp 0.5s ease-out 0.2s both' }}
        >
          <div className="flex items-center gap-2 mb-4 border-b border-gray-700/30 pb-3">
            <Bell className="w-5 h-5 text-yellow-400" />
            <h2 className="text-lg font-bold tracking-wide text-cyan-400">
              Notifications & Alerts
            </h2>
          </div>
          <div className="space-y-1">
            <Toggle
              label="Desktop notifications"
              subtitle="Show system notifications for new threats."
              checked={notifications}
              onChange={setNotifications}
            />
            <div className="border-t border-gray-700/30 my-1"></div>
            <Toggle
              label="Sound alerts on high severity"
              subtitle="Play a loud sound when high-risk threats are detected."
              checked={soundAlerts}
              onChange={setSoundAlerts}
            />
          </div>
        </div>

        {/* Security & Firewall */}
        <div
          className="bg-gradient-to-br from-[#12181b] to-[#0c0f13]
          p-6 rounded-xl border border-cyan-500/10 backdrop-blur-xl
          hover:border-cyan-500/30 transition-all duration-300
          hover:shadow-lg hover:shadow-cyan-500/10"
          style={{ animation: 'fadeInUp 0.5s ease-out 0.3s both' }}
        >
          <div className="flex items-center gap-2 mb-4 border-b border-gray-700/30 pb-3">
            <Shield className="w-5 h-5 text-green-400" />
            <h2 className="text-lg font-bold text-cyan-400 tracking-wide">
              Security & Logging
            </h2>
          </div>
          <div className="space-y-1">
            <Toggle
              label="Auto-block malicious IPs via firewall"
              subtitle="Automatically create firewall rules for confirmed threats."
              checked={firewallBlocking}
              onChange={setFirewallBlocking}
            />
            <div className="border-t border-gray-700/30 my-1"></div>
            <Toggle
              label="Anonymize sensitive IPs in logs"
              subtitle="Mask local/private addresses in exported reports for privacy."
              checked={logAnonymized}
              onChange={setLogAnonymized}
            />
          </div>
        </div>

        {/* Detection Model */}
        <div
          className="bg-gradient-to-br from-[#12181b] to-[#0c0f13]
          p-6 rounded-xl border border-cyan-500/10 backdrop-blur-xl
          hover:border-cyan-500/30 transition-all duration-300
          hover:shadow-lg hover:shadow-cyan-500/10"
          style={{ animation: 'fadeInUp 0.5s ease-out 0.4s both' }}
        >
          <div className="flex items-center gap-2 mb-4 border-b border-gray-700/30 pb-3">
            <Zap className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-bold text-cyan-400 tracking-wide">
              Detection Model
            </h2>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <label className="text-gray-300 mb-2 block font-semibold">Detection Sensitivity</label>
              <select
                value={modelSensitivity}
                onChange={(e) => setModelSensitivity(e.target.value)}
                // Enhanced input styling
                className="bg-[#111827] border border-cyan-500/50 text-sm px-4 py-3 rounded-xl
                outline-none w-full hover:border-cyan-500 focus:border-cyan-400
                transition-all duration-300 cursor-pointer appearance-none"
              >
                <option value="conservative">
                  Conservative (fewer false positives)
                </option>
                <option value="balanced">
                  Balanced (recommended)
                </option>
                <option value="aggressive">
                  Aggressive (catch more suspicious traffic)
                </option>
              </select>
            </div>

            <p className="text-xs text-gray-500 p-3 rounded-lg bg-gray-900/40 border border-gray-700/30 font-medium leading-relaxed">
               This controls how strict the AI model is when classifying traffic
              as malicious vs normal. You can fine-tune thresholds later in the
              ML configuration.
            </p>
          </div>
        </div>
      </div>

      {/* --- SAVE BUTTON --- */}
      <div
        className="flex justify-end pt-4"
        style={{ animation: 'fadeInUp 0.5s ease-out 0.5s both' }}
      >
        <button
          onClick={handleSave}
          className={`group relative px-6 py-3 text-sm rounded-xl font-semibold
          transition-all duration-300 flex items-center gap-2 overflow-hidden
          ${saved
            ? 'bg-green-500/20 border border-green-400/50 text-green-300 shadow-md shadow-green-500/30'
            : 'bg-cyan-500/20 border border-cyan-400/50 text-cyan-200 hover:bg-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40'
          }`}
        >
          {/* Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
            opacity-0 group-hover:opacity-100 translate-x-[-100%] group-hover:translate-x-[100%]
            transition-all duration-700"></div>

          {saved ? (
            <>
              <Check className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Saved Successfully!</span>
            </>
          ) : (
            <span className="relative z-10">Save Settings</span>
          )}
        </button>
      </div>

      {/* --- CUSTOM STYLES & ANIMATIONS --- */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}