import React, { useState, useRef } from 'react';
import { Search, Globe2, MapPin, Clock, DollarSign, Building2, Copy, Camera, Check, Wifi } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { icon } from 'leaflet';

const defaultIcon = icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface IpData {
  ip: string;
  city: string;
  region: string;
  country_name: string;
  postal: string;
  latitude: number;
  longitude: number;
  timezone: string;
  currency: string;
  currency_name: string;
  org: string;
}

function App() {
  const [ipAddress, setIpAddress] = useState('');
  const [ipData, setIpData] = useState<IpData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`https://ipapi.co/${ipAddress}/json/`);
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.reason || 'Invalid IP address');
      }
      
      setIpData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch IP data');
      setIpData(null);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!ipData) return;

    const info = `
IP Address: ${ipData.ip}
Location: ${ipData.city}, ${ipData.region}, ${ipData.country_name}
Postal Code: ${ipData.postal}
Coordinates: ${ipData.latitude}, ${ipData.longitude}
Timezone: ${ipData.timezone}
Currency: ${ipData.currency} (${ipData.currency_name})
Organization: ${ipData.org}
    `.trim();

    navigator.clipboard.writeText(info).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const takeScreenshot = () => {
    if (!resultRef.current) return;

    import('html2canvas').then((html2canvas) => {
      html2canvas.default(resultRef.current!).then((canvas) => {
        const link = document.createElement('a');
        link.download = `ip-lookup-${ipData?.ip}.png`;
        link.href = canvas.toDataURL();
        link.click();
      });
    });
  };

  return (
    <div className="min-h-screen cyber-gradient text-gray-300 p-4 sm:p-6 relative cyber-scanline">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 sm:mb-10">
          <div className="flex items-center justify-center mb-4">
            <Wifi className="w-12 h-12 sm:w-16 sm:h-16 text-[#00ff9d] cyber-glow" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-[#00ff9d] mb-2 sm:mb-4 cyber-glow tracking-wider uppercase">
            NetTrace
          </h1>
          <p className="text-sm sm:text-base text-gray-400">Decrypt the digital footprint. Track any IP in the network.</p>
        </div>

        {/* New warning message section */}
        <div className="bg-yellow-500/10 border-l-4 border-yellow-500 p-4 mb-4 mx-4 sm:mx-0">
          <p className="text-yellow-700 text-sm sm:text-base">
          **Note:** This tool is provided solely for educational purposes. It is intended to help users understand IP address geography and network identification. The information obtained should not be used for any illegal or unethical activities. Always respect privacy and legal considerations when handling personal or sensitive data related to IP addresses. Use this tool responsibly.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mb-6 sm:mb-8">
          <div className="relative max-w-xl mx-auto">
            <input
              type="text"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              placeholder="Enter IP address (e.g., 8.8.8.8)"
              className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-lg bg-gray-900/50 border border-[#00ff9d]/30 focus:border-[#00ff9d] focus:ring-1 focus:ring-[#00ff9d] outline-none text-base sm:text-lg text-[#00ff9d] placeholder-gray-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#00ff9d]/20 hover:bg-[#00ff9d]/30 text-[#00ff9d] px-4 sm:px-6 py-1.5 sm:py-2 rounded-md flex items-center gap-2 transition-colors text-sm sm:text-base border border-[#00ff9d]/50"
            >
              <Search size={18} className="hidden sm:block" />
              {loading ? 'Scanning...' : 'Trace'}
            </button>
          </div>
        </form>

        {error && (
          <div className="border-l-4 border-red-500 p-4 mb-6 sm:mb-8 mx-4 sm:mx-0 bg-red-500/10">
            <p className="text-red-400 text-sm sm:text-base">{error}</p>
          </div>
        )}

        {ipData && (
          <div ref={resultRef} className="space-y-4">
            <div className="flex justify-end gap-2 px-4 sm:px-0">
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 cyber-card rounded-lg hover:bg-[#00ff9d]/10 transition-colors text-sm sm:text-base border border-[#00ff9d]/30"
                title="Copy all information"
              >
                {copied ? <Check className="text-[#00ff9d]" size={18} /> : <Copy size={18} className="text-[#00ff9d]" />}
                <span className="text-gray-300">{copied ? 'Copied!' : 'Copy Data'}</span>
              </button>
              <button
                onClick={takeScreenshot}
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 cyber-card rounded-lg hover:bg-[#00ff9d]/10 transition-colors text-sm sm:text-base border border-[#00ff9d]/30"
                title="Take screenshot"
              >
                <Camera size={18} className="text-[#00ff9d]" />
                <span className="text-gray-300">Capture</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
              <div className="cyber-card rounded-xl p-4 sm:p-8 space-y-4 sm:space-y-6 mx-4 sm:mx-0">
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-[#00ff9d] mb-3 sm:mb-4 flex items-center gap-2">
                    <Globe2 className="text-[#00ff9d]" size={24} />
                    Location Data
                  </h2>
                  <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                    <p className="text-gray-400">IP Address: <span className="text-[#00ff9d] font-mono">{ipData.ip}</span></p>
                    <p className="text-gray-400">City: <span className="text-[#00ff9d]">{ipData.city}</span></p>
                    <p className="text-gray-400">Region: <span className="text-[#00ff9d]">{ipData.region}</span></p>
                    <p className="text-gray-400">Country: <span className="text-[#00ff9d]">{ipData.country_name}</span></p>
                    <p className="text-gray-400">Postal Code: <span className="text-[#00ff9d] font-mono">{ipData.postal}</span></p>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-[#00ff9d] mb-3 sm:mb-4 flex items-center gap-2">
                    <MapPin className="text-[#00ff9d]" size={24} />
                    Coordinates
                  </h2>
                  <div className="space-y-2 sm:space-y-3 text-sm sm:text-base font-mono">
                    <p className="text-gray-400">Latitude: <span className="text-[#00ff9d]">{ipData.latitude}</span></p>
                    <p className="text-gray-400">Longitude: <span className="text-[#00ff9d]">{ipData.longitude}</span></p>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-[#00ff9d] mb-3 sm:mb-4 flex items-center gap-2">
                    <Clock className="text-[#00ff9d]" size={24} />
                    Time & Currency
                  </h2>
                  <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                    <p className="text-gray-400">Timezone: <span className="text-[#00ff9d]">{ipData.timezone}</span></p>
                    <p className="text-gray-400">Currency: <span className="text-[#00ff9d]">{ipData.currency} ({ipData.currency_name})</span></p>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-[#00ff9d] mb-3 sm:mb-4 flex items-center gap-2">
                    <Building2 className="text-[#00ff9d]" size={24} />
                    Network Data
                  </h2>
                  <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                    <p className="text-gray-400">Organization: <span className="text-[#00ff9d]">{ipData.org}</span></p>
                  </div>
                </div>
              </div>

              <div className="cyber-card rounded-xl p-4 h-[400px] lg:h-[600px] mx-4 sm:mx-0">
                <div className="h-full w-full rounded-lg overflow-hidden map-container">
                  <MapContainer
                    center={[ipData.latitude, ipData.longitude] as LatLngExpression}
                    zoom={13}
                    scrollWheelZoom={false}
                    className="h-full w-full"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker 
                      position={[ipData.latitude, ipData.longitude] as LatLngExpression}
                      icon={defaultIcon}
                    >
                      <Popup>
                        <div className="text-center">
                          <p className="font-semibold">{ipData.ip}</p>
                          <p>{ipData.city}, {ipData.region}</p>
                          <p>{ipData.org}</p>
                        </div>
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;